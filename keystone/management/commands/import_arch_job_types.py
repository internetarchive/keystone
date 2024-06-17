from django.core.management.base import BaseCommand

from config import settings

from keystone.arch_api import ArchAPI
from keystone.models import (
    JobCategory,
    JobType,
    User,
)


def import_job_types():
    """Import all job types"""
    user = User.objects.get(username=settings.ARCH_SYSTEM_USER)
    for category_section in ArchAPI.get_json(user, "available-jobs"):
        # Create or update the JobCategory instance.
        cat_name = category_section["categoryName"]
        cat_description = category_section["categoryDescription"]
        if JobCategory.objects.filter(name=cat_name).exists():
            job_cat = JobCategory.objects.get(name=cat_name)
            if job_cat.description != cat_description:
                print(
                    f"Updating category ({cat_name}) description from "
                    f'"{job_cat.description}" to "{cat_description}"'
                )
                job_cat.description = cat_description
                job_cat.save()
        else:
            job_cat = JobCategory.objects.create(
                name=category_section["categoryName"],
                description=category_section["categoryDescription"],
            )
            print(f"Created JobCategory: {job_cat.name}")

        for job in category_section["jobs"]:
            if not JobType.objects.filter(id=job["uuid"]).exists():
                job_type = JobType.objects.create(
                    id=job["uuid"],
                    name=job["name"],
                    category=job_cat,
                    description=job["description"],
                    can_run=not job["internal"],
                    can_publish=job["publishable"],
                    input_quota_eligible=True,
                    output_quota_eligible=True,
                    download_quota_eligible=True,
                    info_url=job["infoUrl"],
                    code_url=job["codeUrl"],
                )
                print(f'Imported JobType: {job_type.id} "{job_type.name}"')
            else:
                job_type = JobType.objects.get(id=job["uuid"])
                print(f'Found existing JobType: {job_type.id} "{job_type.name}"')

                for job_type_k, job_k in (
                    ("name", "name"),
                    ("description", "description"),
                    ("can_publish", "publishable"),
                    ("info_url", "infoUrl"),
                    ("code_url", "codeUrl"),
                ):
                    existing_v = getattr(job_type, job_type_k)
                    new_v = job[job_k]
                    if existing_v != new_v:
                        print(
                            f"Updating {job_type_k} from {repr(existing_v)} to {repr(new_v)}"
                        )
                        setattr(job_type, job_type_k, job[job_k])

                    # Maybe update JobType.category
                    if job_type.category != job_cat:
                        print(
                            f"Updating category from {job_type.category} to {job_cat}"
                        )
                        job_type.category = job_cat

                    # Maybe update JobType.can_run
                    job_can_run = not job["internal"]
                    if job_type.can_run != job_can_run:
                        print(
                            f"Updating can_run from {job_type.can_run} to {job_can_run}"
                        )
                        job_type.can_run = job_can_run

                job_type.save()


class Command(BaseCommand):
    """Import ARCH Job Types"""

    help = "Import ARCH Job Types"

    def handle(self, *args, **options):
        import_job_types()
