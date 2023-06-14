from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError

from keystone.models import Organization


class Command(BaseCommand):
    help = "Create an Organization"

    def add_arguments(self, parser):
        parser.add_argument("name", type=str)

    def handle(self, *args, **options):
        name = options["name"]

        try:
            org = Organization.objects.create(name=name)
        except IntegrityError as e:
            raise CommandError(
                f"Organization already exists with name {name}",
                returncode=1,
            ) from e

        self.stdout.write(f"{org.name} - {org.id}")
