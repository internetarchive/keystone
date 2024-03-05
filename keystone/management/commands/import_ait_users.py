from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError

from keystone.admin import WrapPasswordMixin
from keystone.ait import (
    get_ait_user_info,
    get_ait_account_collections_info,
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
                f"DID NOT IMPORT AIT user (id={ait_user['id']}): user with username=\"{ait_user['username']}\" already exists\n"
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

    def import_ait_users(self, user_ids):
        ait_users = [get_ait_user_info(user_id=user_id) for user_id in user_ids]
        for ait_user in ait_users:
            self.create_user(ait_user)
