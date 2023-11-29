import json

from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError

from keystone.admin import WrapPasswordMixin
from keystone.ait_user import (
    get_ait_user_info,
    get_ait_account_collection_ids,
)
from keystone.models import (
    Account,
    User,
)

from config import settings


class Command(BaseCommand):
    help = "Import AIT Users"

    def add_arguments(self, parser):
        parser.add_argument("ait_user_ids", nargs="+", type=int)

    def handle(self, *args, **options):
        self.import_ait_users(options["ait_user_ids"])

    def create_user(self, ait_user):
        if User.objects.filter(username=ait_user["username"]).exists():
            self.stdout.write(
                f"User already exists with username: {ait_user['username']}\n"
            )
            return
        user = User.objects.create(
            password=f"sha1:{ait_user['password_hash']}",
            first_name=ait_user["first_name"],
            last_name=ait_user["last_name"],
            username=ait_user["username"],
            email=ait_user["email"],
            is_staff=False,
            is_active=True,
            role="USER",
            is_superuser=False,
            account=Account.objects.get(name="General"),
        )
        WrapPasswordMixin.wrap_user_sha1_password(user)
        self.stdout.write(f"Imported AIT user: {ait_user['username']}\n")

    def print_arch_ait_collections_json_message(self, ait_users):
        arch_user_id_collection_ids_map = {
            f"ks:{ait_user['username']}": get_ait_account_collection_ids(
                ait_user["account_id"]
            )
            for ait_user in ait_users
        }
        json_str = json.dumps(
            arch_user_id_collection_ids_map,
            indent=4,
            sort_keys=True,
            # ARCH uses " : " as the key/value separator.
            separators=(",", " : "),
        )
        self.stdout.write(
            f"""
###############################################################################
# To authorize all AIT collections for these users in ARCH, add the following
# entries (within the braces) to the "ait-collections.json" file via the
# ARCH admin UI:
###############################################################################

{json_str}
"""
        )

    def import_ait_users(self, user_ids):
        ait_users = [get_ait_user_info(user_id=user_id) for user_id in user_ids]
        for ait_user in ait_users:
            self.create_user(ait_user)
        self.print_arch_ait_collections_json_message(ait_users)
