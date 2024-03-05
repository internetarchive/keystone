import json

from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
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

    def handle(self, *args, **options):
        self.import_ait_collections(
            options["ait_collection_ids"],
            options["authorize_keystone_account_ids"],
            options["authorize_keystone_team_ids"],
            options["authorize_keystone_user_ids"],
        )

    def create_collection(
        self, ait_collection, account_ids=(), team_ids=(), user_ids=()
    ):
        # Format the ARCH ID.
        arch_id = f'ARCHIVEIT-{ait_collection["id"]}'
        if Collection.objects.filter(arch_id=arch_id).exists():
            self.stdout.write(
                f'DID NOT IMPORT AIT collection (id={ait_collection["id"]}, name="{ait_collection["name"]}"): matching collection already exists\n'
            )
            return

        collection = Collection.objects.create(
            arch_id=arch_id,
            name=ait_collection["name"],
            collection_type=CollectionTypes.AIT,
            size_bytes=ait_collection["total_warc_bytes"],
            latest_dataset=None,
            metadata={
                "ait_id": ait_collection["id"],
                "is_public": ait_collection["publicly_visible"],
                "seed_count": (
                    ait_collection["num_active_seeds"]
                    + ait_collection["num_inactive_seeds"]
                ),
                "last_crawl_date": ait_collection["last_crawl_date"],
            },
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
        self, collection_ids, account_ids=(), team_ids=(), user_ids=()
    ):
        ait_collections = [
            get_ait_collection_info(collection_id=collection_id)
            for collection_id in collection_ids
        ]
        for ait_collection in ait_collections:
            self.create_collection(
                ait_collection,
                account_ids=account_ids,
                team_ids=team_ids,
                user_ids=user_ids,
            )
