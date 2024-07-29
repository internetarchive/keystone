import re
from datetime import datetime, timezone

from django.core.management.base import BaseCommand

from config.settings import KnownArchJobUuids
from keystone.arch_api import ArchAPI
from keystone.models import (
    Collection,
    CollectionTypes,
    JobEventTypes,
    JobStart,
    JobType,
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
    """Return the appropriate Arch ID CollectionTypes value."""
    if normalized_arch_id.startswith("ARCHIVEIT-"):
        return CollectionTypes.AIT
    if normalized_arch_id.startswith("CUSTOM-"):
        return CollectionTypes.CUSTOM
    if normalized_arch_id.startswith("SPECIAL-"):
        return CollectionTypes.SPECIAL
    raise ValueError(f"Could not determine type for collection: {normalized_arch_id}")


def parse_ait_id(normalized_arch_id):
    """Return the interger-type AIT collection ID."""
    return int(normalized_arch_id.split("-")[1])


def ts_to_dt(timestamp):
    """Return timestampt as a timezone-aware datetime."""
    return datetime.fromtimestamp(timestamp).replace(tzinfo=timezone.utc)


def maybe_create_custom_collection_job_start(collection, params):
    """Create a JobStart for the specified custom collection so that
    the collection_detail view will be able to lookup the job params."""
    if JobStart.objects.filter(collection=collection).exists():
        return False
    user = collection.users.first()

    # Pop/parse any specified input/location from params.
    single_collection_id = params.pop("location", None)
    collection_ids = params.pop("input", None)
    # A non-array-type "input" value has been observed in the wild, which we'll
    # handle here by converting to a single ID.
    if isinstance(collection_ids, str):
        single_collection_id = collection_ids
        collection_ids = None
    if collection_ids:
        input_spec = {
            "type": "multi-specs",
            "specs": [
                {"type": "collection", "collectionId": normalize_arch_id(cid)}
                for cid in collection_ids
            ],
        }
    else:
        input_spec = {
            "type": "collection",
            "collectionId": normalize_arch_id(single_collection_id),
        }

    JobStart.objects.create(
        collection=collection,
        job_type=JobType.objects.get(id=KnownArchJobUuids.USER_DEFINED_QUERY),
        user=user,
        input_bytes=collection.size_bytes,
        sample=False,
        parameters={"conf": {"inputSpec": input_spec, "params": params}},
        commit_hash="",
        # Parse the creation time from the trailing timestamp in arch_id.
        created_at=ts_to_dt(int(collection.arch_id.rsplit("_", 1)[1][:-3])),
    )
    return True


def import_user_collections(user):
    """Import all collection for the specified user."""
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
                    f"Updated metadata for collection ({ks_c.arch_id}), "
                    f"was: {old_metadata}, id: {metadata}"
                )

            if (
                ks_c.collection_type == CollectionTypes.CUSTOM
                and maybe_create_custom_collection_job_start(ks_c, arch_c["params"])
            ):
                updated = True
                print(f"Created JobStart for custom collection ({ks_c.arch_id})")

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

            if ks_c.collection_type == CollectionTypes.CUSTOM:
                maybe_create_custom_collection_job_start(ks_c, arch_c["params"])

            print(f"Imported collection ({ks_c.arch_id}) for user ({user.username})")


def assert_that_custom_collection_inputs_are_valid():
    """Check that all input collections referenced by custom-type collection
    JobStart.parameters.input_spec values actually exist."""

    def assert_exists(custom_collection, input_spec):
        try:
            Collection.get_for_input_spec(input_spec)
        except Collection.DoesNotExist:
            print(
                f"JobStart for custom Collection ({custom_collection.arch_id}) "
                f"specifies invalid input_spec: {input_spec}"
            )

    for job_start in JobStart.objects.filter(
        job_type__id=KnownArchJobUuids.USER_DEFINED_QUERY
    ):
        # Ignore existing legacy, JobStart rows.
        if not isinstance(job_start.parameters, dict):
            continue
        input_spec = job_start.parameters["conf"]["inputSpec"]
        if input_spec["type"] == "multi-specs":
            for spec in input_spec["specs"]:
                assert_exists(job_start.collection, spec)
        else:
            assert_exists(job_start.collection, input_spec)


class Command(BaseCommand):
    """Import ARCH Collections"""

    help = "Import ARCH Collections"

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, help="Import for single username")

    def handle(self, *args, **options):
        username = options.get("username")
        if username:
            import_user_collections(User.objects.get(username=username))
        else:
            for user in User.objects.all():
                import_user_collections(user)
        assert_that_custom_collection_inputs_are_valid()
