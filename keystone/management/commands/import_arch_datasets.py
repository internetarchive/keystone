from datetime import datetime

from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from django.db.utils import IntegrityError
from django.db.models import ObjectDoesNotExist
from django.db.models.signals import post_save

from keystone.arch_api import ArchAPI
from keystone.models import (
    Collection,
    Dataset,
    JobComplete,
    JobFile,
    JobStart,
    JobType,
    User,
    job_start_post_save,
    job_complete_post_save,
)


def get_or_create_job_start(**kwargs):
    try:
        return False, JobStart.objects.get(**kwargs)
    except ObjectDoesNotExist:
        return True, JobStart.objects.create(**kwargs)


def import_user_datasets(user):
    for arch_dataset in ArchAPI.get_json(user, "datasets")["results"]:
        # Ignore unfinished datasets during import for now since the UUID ARCH
        # reports in subsequent JobEvent calls won't match the UUID of the
        # synthetic JobStart that we'd create, and thus the job will never be
        # updated to it's final state.
        if arch_dataset["finishedTime"] is None:
            continue

        collection = Collection.objects.filter(
            arch_id=arch_dataset["collectionId"]
        ).first()
        if not collection or not collection.users.filter(pk=user.id).exists():
            raise AssertionError(
                f"""
No Collection with arch_id={arch_dataset['collectionId']} exists
for Keystone user ({user.username}). Maybe run import_arch_collections first?
"""
            )
        # Create a synthetic JobStart instance.
        start_time = datetime.fromisoformat(arch_dataset["startTime"])
        job_start_kwargs = {
            "collection": collection,
            "job_type": JobType.objects.get(id=arch_dataset["jobId"]),
            "user": user,
            "sample": arch_dataset["isSample"],
            "parameters": {"imported": True},
            "commit_hash": "",
            "created_at": start_time,
        }
        created_job_start, job_start = get_or_create_job_start(**job_start_kwargs)

        # Get or create the JobComplete.
        finished_time = datetime.fromisoformat(arch_dataset["finishedTime"])
        job_complete_kwargs = {
            "job_start": job_start,
            "output_bytes": 0,
            "created_at": finished_time,
        }
        if created_job_start:
            job_complete = JobComplete.objects.create(**job_complete_kwargs)
        else:
            job_complete = JobComplete.objects.get(**job_complete_kwargs)

        # Get or create the Dataset.
        dataset_kwargs = {
            "job_start": job_start,
            "state": arch_dataset["state"].upper(),
            "start_time": start_time,
            "finished_time": finished_time,
        }
        if created_job_start:
            dataset = Dataset.objects.create(**dataset_kwargs)
            print(f"Imported Dataset ({arch_dataset['id']})")
        else:
            dataset = Dataset.objects.get(job_start=job_start)

        # Import dataset files.
        num_imported_files = 0
        for f in ArchAPI.get_json(user, f"datasets/{arch_dataset['id']}/files")[
            "results"
        ]:
            job_file_kwargs = {
                "job_complete": job_complete,
                "filename": f["filename"],
                "size_bytes": f["sizeBytes"],
                "mime_type": f["mimeType"],
                "line_count": f["lineCount"],
                "file_type": f["fileType"],
                "creation_time": datetime.fromisoformat(f["creationTime"]),
                "md5_checksum": f["md5Checksum"],
                "access_token": f["accessToken"],
            }
            if not JobFile.objects.filter(**job_file_kwargs).exists():
                JobFile.objects.create(**job_file_kwargs)
                print(
                    f"Imported Dataset ({arch_dataset['id']}) file ({f['filename']}) info"
                )


class Command(BaseCommand):
    help = "Import ARCH Datasets"

    def handle(self, *args, **options):
        # Disconnect JobStart and JobComplete signal receivers.
        assert post_save.disconnect(job_start_post_save, JobStart)
        assert post_save.disconnect(job_complete_post_save, JobComplete)

        for user in User.objects.all():
            import_user_datasets(user)
