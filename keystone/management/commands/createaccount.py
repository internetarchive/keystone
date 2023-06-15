from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError

from keystone.models import Account


class Command(BaseCommand):
    help = "Create an Account"

    def add_arguments(self, parser):
        parser.add_argument("name", type=str)

    def handle(self, *args, **options):
        name = options["name"]

        try:
            account = Account.objects.create(name=name)
        except IntegrityError as e:
            raise CommandError(
                f"Account already exists with name {name}",
                returncode=1,
            ) from e

        self.stdout.write(f"{account.name} - {account.id}")
