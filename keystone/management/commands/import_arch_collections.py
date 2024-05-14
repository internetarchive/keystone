import re
from datetime import datetime

from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError

from keystone.arch_api import ArchAPI
from keystone.models import (
    Collection,
    CollectionTypes,
    JobEventTypes,
    User,
)


ARCH_ID_NORMALIZATION_REGEX = re.compile(
    r"^((?:ARCHIVEIT|SPECIAL)-)(?:ks\:[^\:]+\:)?(.+)$"
)


def normalize_arch_id(arch_id):
    """Strip any embedded username from AIT and SPECIAL collection IDs because
    their inclusion will cause requests made to the UUID-based job running endpoint
    to return a collection size of -1 (which will cause a Keystone IntegrityError)
    and result in an empty job output.
    """
    match = ARCH_ID_NORMALIZATION_REGEX.match(arch_id)
    if match:
        return "".join(match.groups())
    if arch_id.startswith(("ARCHIVEIT-", "SPECIAL-")):
        raise AssertionError(f"arch_id normalization failed for: {arch_id}")
    return arch_id


def get_arch_collection_type(normalized_arch_id):
    if normalized_arch_id.startswith("ARCHIVEIT-"):
        return CollectionTypes.AIT
    elif normalized_arch_id.startswith("CUSTOM-"):
        return CollectionTypes.CUSTOM
    elif normalized_arch_id.startswith("SPECIAL-"):
        return CollectionTypes.SPECIAL
    raise ValueError(f"Could not determine type for collection: {normalized_arch_id}")


def parse_ait_id(normalized_arch_id):
    return int(normalized_arch_id.split("-")[1])


def import_user_collections(user):
    for arch_c in ArchAPI.get_json(user, "collections")["results"]:
        # Normalize the ARCH Collection ID and detect the collection type.
        normalized_arch_id = normalize_arch_id(arch_c["id"])
        collection_type = get_arch_collection_type(normalized_arch_id)
        # Create the metadata dict.
        if collection_type == CollectionTypes.AIT:
            metadata = {
                "ait_id": parse_ait_id(normalized_arch_id),
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
        ks_c = Collection.objects.filter(arch_id=normalized_arch_id).first()
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
                arch_id=normalized_arch_id,
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

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, help="Import for single username")

    def handle(self, *args, **options):
        username = options.get("username")
        if username:
            import_user_collections(User.objects.get(username=username))
            return

        for user in User.objects.all():
            import_user_collections(user)
