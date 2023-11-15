import re
from datetime import datetime

import requests
from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError

from keystone.models import (
    Collection,
    CollectionTypes,
    JobEventTypes,
    User,
)

from config import settings


ARCH_ID_AIT_ID_REGEX = re.compile("^.+[\-:](\d+)$")


def parse_ait_id(arch_id):
    match = ARCH_ID_AIT_ID_REGEX.match(arch_id)
    if not match:
        raise AssertionError(f"Could not parse AIT ID from arch_id: {arch_id}")
    return int(match.group(1))


def get_arch_collections(user, settings):
    return requests.get(
        f"{settings.ARCH_API_BASE_URL}/collections",
        headers={
            "X-API-USER": f"ks:{user.username}",
            "X-API-KEY": settings.ARCH_SYSTEM_API_KEY,
        },
    ).json()["results"]


def get_arch_collection_type(arch_c):
    if arch_c["id"].startswith("ARCHIVEIT-"):
        return CollectionTypes.AIT
    elif arch_c["id"].startswith("CUSTOM-"):
        return CollectionTypes.CUSTOM
    elif arch_c["id"].startswith("SPECIAL-"):
        return CollectionTypes.SPECIAL
    raise ValueError(f"Could not determine type for collection: {arch_c['id']}")


def import_user_collections(user):
    for arch_c in get_arch_collections(user, settings):
        # Create the metadata dict.
        collection_type = get_arch_collection_type(arch_c)
        if collection_type == CollectionTypes.AIT:
            metadata = {
                "ait_id": parse_ait_id(arch_c["id"]),
                "is_public": arch_c["public"],
                "seed_count": arch_c["seeds"],
                "last_crawl_date": (
                    # Truncate the date to a seconds resolution.
                    datetime.fromisoformat(arch_c["lastCrawlDate"])
                    .replace(microsecond=0)
                    .isoformat()
                    if arch_c["lastCrawlDate"]
                    else None
                ),
            }
        elif collection_type == CollectionTypes.CUSTOM:
            metadata = {"state": JobEventTypes.FINISHED}
        else:
            metadata = None

        # Lookup any existing Collection.
        ks_c = Collection.objects.filter(arch_id=arch_c["id"]).first()
        if ks_c:
            # Collection exists. Maybe update it.
            updated = False

            # Maybe add the user.
            if not ks_c.users.filter(pk=user.id).exists():
                ks_c.users.add(user)
                updated = True
                print(f"Added user ({user.username}) to collection ({ks_c.arch_id})")

            # Maybe update the metadata.
            if ks_c.metadata != metadata:
                old_metadata = ks_c.metadata
                ks_c.metadata = metadata
                updated = True
                print(
                    f"Updated metadata for collection ({ks_c.arch_id}), was: {old_metadata}, id: {metadata}"
                )

            if updated:
                ks_c.save()
            else:
                print(f"Collection ({ks_c.arch_id}) is up-to-date")
        else:
            # Collection does not exist, so create it.
            ks_c = Collection(
                arch_id=arch_c["id"],
                name=arch_c["name"],
                collection_type=collection_type,
                size_bytes=arch_c["sortSize"],
            )
            ks_c.metadata = metadata
            ks_c.save()
            ks_c.users.add(user)

            print(f"Imported collection ({ks_c.arch_id}) for user ({user.username})")


class Command(BaseCommand):
    help = "Import ARCH Collections"

    def handle(self, *args, **options):
        for user in User.objects.all():
            import_user_collections(user)
