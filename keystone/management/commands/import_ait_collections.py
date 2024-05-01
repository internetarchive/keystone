import json

from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.core.serializers.json import DjangoJSONEncoder
from django.db.utils import IntegrityError

from keystone.ait import get_ait_collection_info
from keystone.models import (
    Account,
    Collection,
    CollectionTypes,
)

from config import settings


class Command(BaseCommand):
    help = "Import AIT Collections"

    def add_arguments(self, parser):
        parser.add_argument("ait_collection_ids", nargs="+", type=int)
        parser.add_argument("--authorize-keystone-account-ids", nargs="+", type=int)
        parser.add_argument("--authorize-keystone-team-ids", nargs="+", type=int)
        parser.add_argument("--authorize-keystone-user-ids", nargs="+", type=int)
        parser.add_argument(
            "--update-only",
            action="store_true",
            help="Update the name, size_bytes, and metadata of previously-imported collections",
        )

    def handle(self, *args, **options):
        self.import_ait_collections(
            options["ait_collection_ids"],
            options["authorize_keystone_account_ids"],
            options["authorize_keystone_team_ids"],
            options["authorize_keystone_user_ids"],
            options["update_only"],
        )

    def create_or_update_collection(
        self,
        ait_collection,
        account_ids=(),
        team_ids=(),
        user_ids=(),
        update_only=False,
    ):
        # Construct the metadata object.
        metadata = {
            "ait_id": ait_collection["id"],
            "is_public": ait_collection["publicly_visible"],
            "seed_count": (
                ait_collection["num_active_seeds"]
                + ait_collection["num_inactive_seeds"]
            ),
            "last_crawl_date": ait_collection["last_crawl_date"],
        }

        # Format the ARCH ID.
        arch_id = f'ARCHIVEIT-{ait_collection["id"]:05}'

        if Collection.objects.filter(arch_id=arch_id).exists():
            if not update_only:
                self.stdout.write(
                    f'DID NOT IMPORT AIT collection (id={ait_collection["id"]}, name="{ait_collection["name"]}"): matching collection already exists\n'
                )
                return
            # Maybe update the collection name, size_bytes, and metadata.
            collection = Collection.objects.get(arch_id=arch_id)

            # Test aginst the serialized/deserialized metadata value to avoid false
            # positives on values like datetimes.
            any_updated = False
            for k, v in (
                ("name", ait_collection["name"]),
                ("size_bytes", ait_collection["total_warc_bytes"]),
                ("metadata", json.loads(DjangoJSONEncoder().encode(metadata))),
            ):
                if getattr(collection, k) != v:
                    setattr(collection, k, v)
                    any_updated |= True
            if any_updated:
                collection.save()
                self.stdout.write(
                    f"Updated previously-imported AIT collection: {ait_collection['id']}: \"{ait_collection['name']}\"\n"
                )
            return

        # Raise an error if trying to import a collection in update-only mode.
        if update_only:
            raise AssertionError(
                f"Can not import AIT collection in update-only mode: {ait_collection}"
            )

        collection = Collection.objects.create(
            arch_id=arch_id,
            name=ait_collection["name"],
            collection_type=CollectionTypes.AIT,
            size_bytes=ait_collection["total_warc_bytes"],
            metadata=metadata,
        )

        # Set Accounts, Teams, and Users.
        if account_ids:
            collection.accounts.add(*account_ids)
        if team_ids:
            collection.teams.add(*team_ids)
        if user_ids:
            collection.users.add(*user_ids)

        self.stdout.write(
            f"Imported AIT collection: {ait_collection['id']}: \"{ait_collection['name']}\"\n"
        )

    def import_ait_collections(
        self,
        collection_ids,
        account_ids=(),
        team_ids=(),
        user_ids=(),
        update_only=False,
    ):
        ait_collections = [
            get_ait_collection_info(collection_id=collection_id)
            for collection_id in collection_ids
        ]
        for ait_collection in ait_collections:
            self.create_or_update_collection(
                ait_collection,
                account_ids=account_ids,
                team_ids=team_ids,
                user_ids=user_ids,
                update_only=update_only,
            )
