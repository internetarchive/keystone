"""
Import datasets from a file comprising multiple concatenated
ARCH {uuid}.uuid.json and job info.json job output files.

Example input file format:

  {
    ... 1.uuid.json record for UUID=1 ...
  }
  {
    ... job info.json record for UUID=1 ...
  }
  {
    ... 2.uuid.json record for UUID=2 ...
  }
  ...

Example input file data:

  {
    "jobUuid" : "01895069-6750-73bb-b758-a64b417097f0",
    "jobId" : "TextFilesInformationExtraction",
    "conf" : {
      "inputSpec" : {
        "type" : "collection",
        "collectionId" : "CUSTOM-ks:system:ARCHIVEIT-00001_1718643923239"
      },
      "outputPath" : "/user/arch/uuid-out/01902800-8661-7618-a2ce-9fc2a2db96b9",
      "sample" : -1,
      "params" : {
        "dataset" : "TextFilesInformationExtraction"
      }
    },
    "user" : "ks:system"
  }
  {
    "uuid" : "01902800-8661-7618-a2ce-9fc2a2db96b9",
    "conf" : {
      "inputSpec" : {
        "type" : "collection",
        "collectionId" : "CUSTOM-ks:system:ARCHIVEIT-00001_1718643923239"
      },
      "outputPath" : "/user/arch/uuid-out/01902800-8661-7618-a2ce-9fc2a2db96b9",
      "sample" : -1,
      "params" : {
        "dataset" : "TextFilesInformationExtraction"
      }
    },
    "started" : 1718643985,
    "finished" : 1718643992
  }
  ...

Note that the "conf" value is identical across the two record types for a given UUID,
and the following fields are exclusive to each type:
  - {uuid}.uuid.json: "jobUuid", "jobId", "user"
  - info.json: "uuid", "started", "finished"

You can generate this input file from ARCH using one of the following methods:

1. From the scala console, writing the output to
"${ArchConf.uuidJobOutPath}/concatenated.uuid.json":

  import org.archive.webservices.sparkling.io.HdfsIO
  import org.archive.webservices.ars.model.ArchConf

  val uuidJobOutPath = ArchConf.uuidJobOutPath.get
  HdfsIO.concat(
    HdfsIO.files(s"${uuidJobOutPath}/{**/*.uuid.json,**/**/info.json}").toSeq,
    s"${uuidJobOutPath}/concatenated.uuid.json"
  )

2. Using the hdfs cli, redirecting the output to a local file:

  hdfs dfs -cat '{configuredUuidOutPath}/{**/*.uuid.json,**/**/info.json}' > \
    /tmp/concatenated.uuid.json
"""
import argparse
import json
from collections import defaultdict
from datetime import datetime, timezone
from io import StringIO
from pprint import pformat
from os import path

from django.core.management.base import (
    BaseCommand,
    CommandError,
)

from config import settings
from keystone.arch_api import ArchAPI
from keystone.models import (
    Account,
    Collection,
    Dataset,
    JobComplete,
    JobFile,
    JobStart,
    JobType,
    JobEventTypes,
    User,
)


MERGED_RECORD_KEYS = {
    "conf",
    "finished",
    "jobId",
    "jobUuid",
    "started",
    "user",
    "uuid",
}
STARTED_NOT_FINISHED_RECORD_KEYS = MERGED_RECORD_KEYS - {"finished"}


class NotKeystoneUser(Exception):
    """Indicate that user is not a supported Keystone user."""


def ts_to_dt(timestamp):
    """Return timestampt as a timezone-aware datetime."""
    return datetime.fromtimestamp(timestamp).replace(tzinfo=timezone.utc)


def json_records(json_fh):
    """Iteratively parse *.uuid.json-style file records."""
    sio = StringIO()
    for line in json_fh:
        sio.write(line)
        if line == "}\n":
            sio.seek(0)
            yield json.load(sio)
            sio.truncate(0)
            sio.seek(0)


def get_merged_dataset_records(json_fh):
    """Merge the concatenated *.uuid.json and info.json records into a single
    record comprising the superset of all fields for each dataset by UUID."""
    uuid_record_map = defaultdict(dict)
    for record in json_records(json_fh):
        # Parse the UUID from conf.outputPath which is present in both types.
        uuid = path.basename(record["conf"]["outputPath"])
        # If record is info.json-type, verify that the UUID matches.
        if "uuid" in record and record["uuid"] != uuid:
            raise CommandError(f"UUID mismatch: {record}")
        # Merge the records.
        uuid_record_map[uuid] |= record
    # Ensure that every record has a fully-populated field set.
    incomplete_record_uuids = {
        uuid
        for uuid, r in uuid_record_map.items()
        if set(r.keys()) != MERGED_RECORD_KEYS
    }
    # Get UUIDs for records that specify all but the "finished" key, indicating that
    # they were started but never finished.
    started_not_finished_record_uuids = {
        uuid
        for uuid in incomplete_record_uuids
        if set(uuid_record_map[uuid].keys()) == STARTED_NOT_FINISHED_RECORD_KEYS
    }
    if started_not_finished_record_uuids:
        # Remove the started-not-finished records from the incomplete list.
        incomplete_record_uuids -= started_not_finished_record_uuids
        print(
            f"Record UUIDs missing a 'finished' key:\n{pformat(started_not_finished_record_uuids)}"
        )
    if incomplete_record_uuids:
        raise CommandError(
            f"Incomplete record UUIDs:\n{pformat(incomplete_record_uuids)}"
        )
    # Return only complete/finished records.
    return [
        r
        for uuid, r in uuid_record_map.items()
        if uuid not in started_not_finished_record_uuids
    ]


def get_job_type(record):
    """Attempt to retrieve the JobType."""
    job_id = record["jobUuid"]
    try:
        return JobType.objects.get(id=job_id)
    except JobType.DoesNotExist:
        # pylint: disable-next=raise-missing-from
        raise CommandError(
            f"No JobType found for id={job_id}. "
            "Do you need to run `import_arch_job_types`?"
        )


def get_collection(record):
    """Attempt to retrieve the Collection."""
    input_spec = record["conf"]["inputSpec"]
    try:
        return Collection.get_for_input_spec(input_spec)
    except Collection.DoesNotExist:
        # pylint: disable-next=raise-missing-from
        raise CommandError(
            f"No Collection found for inputSpec={input_spec}. "
            "Do you need to run `import_arch_collections`?"
        )


def get_or_create_global_datasets_user():
    """Get or create a user to serve as the global datasets owner."""
    try:
        return User.objects.get(username=settings.GLOBAL_USER_USERNAME)
    except User.DoesNotExist:
        pass
    # Get or create the global user account.
    try:
        account = Account.objects.get(name=settings.GLOBAL_USER_ACCOUNT_NAME)
    except Account.DoesNotExist:
        account = Account.objects.create(name=settings.GLOBAL_USER_ACCOUNT_NAME)
    return User.objects.create(
        username=settings.GLOBAL_USER_USERNAME,
        email=f"{settings.GLOBAL_USER_USERNAME}+arch@archive.org",
        account=account,
    )


def get_user(record):
    """Attempt to retrieve the User."""
    record_user = record["user"]
    is_global = record_user == settings.ARCH_GLOBAL_USERNAME
    if is_global:
        return get_or_create_global_datasets_user()
    if not record_user.startswith("ks:"):
        raise NotKeystoneUser
    username = record_user[3:]
    try:
        return User.objects.get(username=username)
    except User.DoesNotExist:
        # pylint: disable-next=raise-missing-from
        raise CommandError(f"No User found for username={username}. ")


def get_or_create_job_start(record, collection, user, job_type):
    """Get or create a JobStart object."""
    try:
        return JobStart.objects.get(id=record["uuid"])
    except JobStart.DoesNotExist:
        return JobStart.objects.create(
            id=record["uuid"],
            collection=collection,
            job_type=job_type,
            user=user,
            sample=record["conf"]["sample"] == -1,
            parameters={"imported": True},
            commit_hash="",
            created_at=ts_to_dt(record["started"]),
        )


def get_or_create_job_complete(record, job_start):
    """Get or create a JobComplete object."""
    try:
        return JobComplete.objects.get(job_start=job_start)
    except JobComplete.DoesNotExist:
        return JobComplete.objects.create(
            job_start=job_start,
            output_bytes=0,
            created_at=ts_to_dt(record["finished"]),
        )


def update_dataset(record, job_start, job_complete):
    """Update the Dataset obect that was automatically created by the
    Job Start, but never updated by a FINISHED-type JobEvent (because
    we didn't create one)."""
    dataset = Dataset.objects.get(job_start=job_start)
    dataset_str = " | ".join(
        str(x)
        for x in (
            record["uuid"],
            record["user"],
            job_start.collection,
            job_start.job_type.name,
            job_start.created_at,
        )
    )
    if dataset.state == JobEventTypes.FINISHED:
        print(f"Dataset already imported: {dataset_str}")
        return
    dataset.state = JobEventTypes.FINISHED
    dataset.start_time = job_start.created_at
    dataset.finished_time = job_complete.created_at
    dataset.save()
    print(f"Imported Dataset: {dataset_str}")


class ArchGlobalUser(User):
    """Override arch_username for the ARCH global datasets user so that
    ArchAPI.request will send the correct, authorized username.
    """

    @property
    def arch_username(self):
        return settings.ARCH_GLOBAL_USERNAME


def maybe_create_job_files(record, user, job_complete):
    """Ensure a JobFile exists for each item in the ARCH API /api/job/{uuid}/files
    response."""
    # If user is the global import user, cast it to ArchGlobalUser.
    if user.username == settings.GLOBAL_USER_USERNAME:
        user.__class__ = ArchGlobalUser

    # Disable request timeout because some jobs include tons (e.g. 100K) of files,
    # and can take a while.
    for f in ArchAPI.get_json(user, f"job/{record['uuid']}/files", timeout=None):
        job_file_kwargs = {
            "job_complete": job_complete,
            "filename": f["filename"],
            "size_bytes": f["sizeBytes"],
            "mime_type": f["mimeType"],
            "line_count": max(f["lineCount"], 0),
            "file_type": f["fileType"],
            "creation_time": datetime.fromisoformat(f["creationTime"]),
            "md5_checksum": f["md5Checksum"],
            "access_token": f["accessToken"],
        }
        if not JobFile.objects.filter(**job_file_kwargs).exists():
            try:
                JobFile.objects.create(**job_file_kwargs)
            except Exception:
                print(f"Error creating JobFile with kwargs: {job_file_kwargs}")
                raise
            print(f"Imported Dataset ({record['uuid']}) job file: ({f['filename']})")


def import_arch_dataset(record):
    """Maybe import the dataset indicated by the record."""
    try:
        user = get_user(record)
    except NotKeystoneUser:
        print(f"Ignoring dataset for unsupported user: {record['user']}")
        return
    job_type = get_job_type(record)
    collection = get_collection(record)
    # Create the JobStart, JobComplete, and Dataset entries.
    job_start = get_or_create_job_start(record, collection, user, job_type)
    job_complete = get_or_create_job_complete(record, job_start)
    update_dataset(record, job_start, job_complete)
    # Temporarily omit WAT/WANE datasets from JobFile import.
    # see: https://webarchive.jira.com/browse/WT-2870
    if job_type.id in {
        settings.KnownArchJobUuids.WEB_ARCHIVE_TRANSFORMATION,
        settings.KnownArchJobUuids.NAMED_ENTITIES,
    }:
        print(f"Skipping JobFile import for WAT/WANE Dataset: {record['uuid']}")
    else:
        maybe_create_job_files(record, user, job_complete)


def import_arch_datasets(json_fh):
    """Import the dataset represented in the concatenated json file."""
    for dataset_record in get_merged_dataset_records(json_fh):
        try:
            import_arch_dataset(dataset_record)
        except Exception:
            print(f"Error while attempting to import record: {pformat(dataset_record)}")
            raise


class Command(BaseCommand):
    """Import ARCH Datasets."""

    help = "Import ARCH Datasets from a single, or concated, *.uuid.json file"

    def add_arguments(self, parser):
        parser.add_argument("uuid_json_file_path", type=argparse.FileType("r"))

    def handle(self, *args, **options):
        import_arch_datasets(options["uuid_json_file_path"])
