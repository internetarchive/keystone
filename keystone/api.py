import http
from typing import (
    Any,
    List,
    Optional,
    Tuple,
)

from datetime import datetime
from uuid import UUID

from django.forms import model_to_dict
from django.http import HttpRequest, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, QuerySet
from django.templatetags.static import static
from ninja.errors import HttpError
from ninja.pagination import paginate
from ninja.parser import Parser
from ninja import (
    Field,
    FilterSchema,
    ModelSchema,
    NinjaAPI,
    Query,
    Schema,
)
from ninja.security import (
    APIKeyHeader,
    HttpBasicAuth,
    django_auth,
)


from config import settings

from . import jobmail
from .arch_api import ArchAPI
from .helpers import (
    dot_to_dunder,
    find_field_from_lookup,
)
from .models import (
    Collection,
    CollectionTypes,
    Dataset,
    JobCategory,
    JobComplete,
    JobEvent,
    JobEventTypes,
    JobFile,
    JobStart,
    JobType,
    User,
)


###############################################################################
# Constants
###############################################################################


HTTP_NO_CONTENT = http.client.NO_CONTENT.value
HTTP_ACCEPTED = http.client.ACCEPTED.value


###############################################################################
# Authentication Classes
###############################################################################


class ApiKey(APIKeyHeader):
    """Auth handler for Keystone's private API.
    Server-to-server requests to Keystone use X-API-Key header to make
    authenticated requests.
    """

    param_name = "X-API-Key"

    def authenticate(self, request, key):
        if key == settings.PRIVATE_API_KEY:
            return key
        return None


class BasicAuth(HttpBasicAuth):
    """Auth handler for HTTP Basic Authentication."""

    def authenticate(self, request, username, password):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            request.user = user
            return username
        return None


###############################################################################
# Request Helpers
###############################################################################


class KeystoneRequestParser(Parser):
    """Override default querydict parser to convert dot-delimited model
    field references to the double-underscore delimited references that Django
    expects.
    """

    def parse_querydict(self, *args, **kwargs):
        qd = super().parse_querydict(*args, **kwargs)
        return {dot_to_dunder(k): v for k, v in qd.items()}


def apply_sort_param(
    request: HttpRequest, queryset: QuerySet, schema: type[Schema]
) -> QuerySet:
    """Apply any specified request "sort" param to the queryset as an
    order_by()"""
    sort_str = request.GET.get("sort")
    if sort_str is None:
        return queryset
    # Resolve field aliases.
    order_by_args = []
    invalid_fields = []
    for field_spec in sort_str.split(","):
        # Get the field name less any leading "+" or "-".
        field_name = field_spec[1:] if field_spec.startswith(("-", "+")) else field_spec
        schema_field = schema.__fields__.get(field_name)
        if schema_field is None:
            invalid_fields.append(field_name)
        else:
            # Append the field alias as an order_by arg, with any specified "-"
            # prefix, and replacing all "." with "__" to make the related lookup
            # work, e.g. "job_start.job_type.category" becomes
            # "job_start__job_type__category".
            order_by_args.append(
                ("-" if field_spec.startswith("-") else "")
                + schema_field.alias.replace(".", "__")
            )
    if invalid_fields:
        raise HttpError(400, f"Can not sort by invalid fields: {invalid_fields}")
    return queryset.order_by(*order_by_args)


def get_model_queryset_filter_values(queryset, field_path, filter_schema):
    """For a given queryset, return the distinct, filterable values as
    (value, displayValue) tuples, less NULLs, that exist for the specified
    field path, or raise a HttpError(400, ...) if the filter_schema doesn't
    implement the specified field path.
    """
    # Replace all "." with "__" in the field_path.
    field_name = dot_to_dunder(field_path)
    # Return a 400 if field_name is not defined in the filter schema.
    filter_schema_props = filter_schema.schema()["properties"]
    if field_name == "search" or field_name not in filter_schema_props:
        raise HttpError(400, f"Filtering not supported for field: {field_path}")
    # Use the filter schema to de-alias the field path.
    field_prop_q = filter_schema_props[field_name].get("q")
    if field_prop_q is not None:
        if not isinstance(field_prop_q, str):
            raise HttpError(400, f"Filtering not supported for field: {field_path}")
        field_name = field_prop_q.removesuffix("__in")
    # Do the query.
    values = list(
        queryset.filter(**{f"{field_name}__isnull": False})
        .values_list(field_name, flat=True)
        .distinct()
    )
    # If the ultimate model field is a TextChoice, return (value, displayValue) tuples.
    field = find_field_from_lookup(queryset.model, field_name)
    value_display_map = dict(field.choices or ())
    return [(v, value_display_map.get(v, v)) for v in values]


###############################################################################
# APIs
###############################################################################


# Ninja requires distinct `urls_namespace` or `version` args for each NinjaAPI object.
# If csrf is on, Ninja will require it even if using APIKeyHeader.
public_api = NinjaAPI(
    urls_namespace="public",
    csrf=True,
    auth=[django_auth],
    parser=KeystoneRequestParser(),
)

private_api = NinjaAPI(
    urls_namespace="private", auth=[ApiKey()], parser=KeystoneRequestParser()
)

wasapi_api = NinjaAPI(
    urls_namespace="wasapi",
    csrf=True,
    auth=[django_auth, BasicAuth()],
)


###############################################################################
# Shared Schemas
###############################################################################


class DatasetFileSchema(Schema):
    """Respose schema for a DatasetFile object."""

    filename: str
    sizeBytes: int
    mimeType: str
    lineCount: int
    fileType: str
    creationTime: str
    md5Checksum: Optional[str]
    accessToken: str


###############################################################################
# Private API Schemas
###############################################################################


class JobStartInParametersConfWithParams(Schema):
    """A JobStartIn.parameters.conf value that include params."""

    inputSpec: dict
    outputPath: str
    sample: int
    params: dict


class JobStartInParametersConfNoParams(Schema):
    """A JobStartIn.parameters.conf value that does not include params."""

    inputSpec: dict
    outputPath: str
    sample: int


class JobStartInParameters(Schema):
    """An JobStartIn.parameters value."""

    instance_hashcode: str
    attempt: int
    conf: JobStartInParametersConfWithParams | JobStartInParametersConfNoParams


class JobStartIn(Schema):
    """Request POST payload schema for JobStart registration"""

    id: str
    job_type_id: str
    collection_id: str
    username: str
    input_bytes: int
    sample: bool
    parameters: JobStartInParameters
    commit_hash: str
    created_at: str


class JobStartOut(ModelSchema):
    """Response schema for JobStart registration."""

    class Config:
        """Ninja ModelSchema configuration."""

        model = JobStart
        model_fields = [
            "id",
            "job_type",
            "collection",
            "user",
            "input_bytes",
            "sample",
            "parameters",
            "commit_hash",
            "created_at",
        ]


class JobEventIn(Schema):
    """Request POST payload schema for JobEvent registration"""

    job_start_id: str
    event_type: str
    created_at: str


class JobEventOut(ModelSchema):
    """Response schema for JobEvent registration"""

    class Config:
        """Ninja ModelSchema configuration."""

        model = JobEvent
        model_fields = [
            "id",
            "job_start",
            "event_type",
            "created_at",
        ]


class JobCompleteIn(Schema):
    """Request POST payload schema for JobComplete registration"""

    job_start_id: str
    output_bytes: int
    created_at: str
    files: List[DatasetFileSchema]


class PermissionResponse(Schema):
    """Response schema for Keystone permission requests"""

    allow: bool


###############################################################################
# Public API Schemas
###############################################################################


class AITCollectionMetadata(Schema):
    """Represents AIT collection-specific metadata."""

    is_public: bool
    seed_count: int
    last_crawl_date: Optional[datetime]


class CustomCollectionMetadata(Schema):
    """Represents custom collection-specific metadata."""

    state: JobEventTypes


class LatestDatasetSchema(Schema):
    """Represents a Keystone Dataset"""

    id: int
    name: str = Field(..., alias="job_start.job_type.name")
    start_time: datetime


class CollectionSchema(Schema):
    """Represents a Keystone Collection"""

    id: int
    name: str
    collection_type: str
    size_bytes: int
    dataset_count: int
    latest_dataset: LatestDatasetSchema = None
    metadata: Optional[AITCollectionMetadata | CustomCollectionMetadata] = None


class CollectionFilterSchema(FilterSchema):
    """Collection filters"""

    # Suppress "Method 'custom_expression' is abstract in class 'FilterSchema' ..."
    # pylint: disable=abstract-method

    search: Optional[str] = Field(None, q=["name__icontains"])

    # In order to support multiple query values for a single field,
    # use type of Optional[List[T]] and a Field q value like "...__in".
    id: Optional[List[int]] = Field(None, q="id__in")
    collection_type: Optional[List[CollectionTypes]] = Field(
        None, q="collection_type__in"
    )
    metadata__is_public: Optional[List[bool]] = Field(None, q="metadata__is_public__in")


class DatasetSchema(Schema):
    """Represents a Keystone Dataset"""

    id: int
    collection_id: int = Field(..., alias="job_start.collection.id")
    collection_name: str = Field(..., alias="job_start.collection.name")
    is_sample: bool = Field(..., alias="job_start.sample")
    job_id: UUID = Field(..., alias="job_start.job_type.id")
    category_name: str = Field(..., alias="job_start.job_type.category.name")
    name: str = Field(..., alias="job_start.job_type.name")
    state: str
    start_time: datetime
    finished_time: Optional[datetime]


class DatasetFilterSchema(FilterSchema):
    """Dataset filters"""

    # Suppress "Method 'custom_expression' is abstract in class 'FilterSchema' ..."
    # pylint: disable=abstract-method

    search: Optional[str] = Field(
        None,
        q=[
            "job_start__job_type__name__icontains",
            "job_start__job_type__category__name__icontains",
            "job_start__collection__name__icontains",
            "state__icontains",
        ],
    )

    # In order to support multiple query values for a single field,
    # use type of Optional[List[T]] and a Field q value like "...__in".
    id: Optional[List[int]] = Field(None, q="id__in")
    name: Optional[List[str]] = Field(None, q="job_start__job_type__name__in")
    category_name: Optional[List[str]] = Field(
        None, q="job_start__job_type__category__name__in"
    )
    collection_id: Optional[List[str]] = Field(None, q="job_start__collection__id__in")
    collection_name: Optional[List[str]] = Field(
        None, q="job_start__collection__name__in"
    )
    is_sample: Optional[List[bool]] = Field(None, q="job_start__sample__in")
    state: Optional[List[str]] = Field(None, q="state__in")


class JobCategorySchema(ModelSchema):
    """Represents a JobCategory"""

    class Config:
        """Ninja ModelSchema configuration."""

        model = JobCategory
        model_fields = [
            "name",
            "description",
        ]


class AvailableJob(Schema):
    """An available Dataset generation job."""

    id: str
    name: str
    description: str


class AvailableJobsCategory(Schema):
    """A category of available Dataset generation jobs."""

    categoryName: str
    categoryDescription: str
    categoryImage: str
    categoryId: int
    jobs: List[AvailableJob]


###############################################################################
# Public API ARCH Proxy Schemas
###############################################################################


class DatasetPublicationInfo(Schema):
    """Information about a published Dataset"""

    item: str
    source: str
    collection: str
    job: str
    complete: bool
    sample: bool
    time: str
    ark: str


class DatasetPublicationMetadata(Schema):
    """Metadata of a published petbox Dataset item"""

    creator: List[str] = None
    description: List[str] = None
    licenseurl: List[str] = None
    subject: List[str] = None
    title: List[str] = None


class DatasetGenerationRequest(Schema):
    """Request POST payload schema for Dataset (re)generation."""

    collection_id: int
    job_type_id: str
    is_sample: bool
    rerun: Optional[bool] = False


class SubCollectionCreationRequest(Schema):
    """Request POST payload schema for Sub-collection creation."""

    sources: List[str]
    name: Optional[str]
    surtPrefixesOR: Optional[List[str]]
    timestampFrom: Optional[str]
    timestampTo: Optional[str]
    statusPrefixesOR: Optional[List[str]]
    mimesOR: Optional[List[str]]


class JobStateInfo(Schema):
    """Information about the state of an ARCH job"""

    id: str
    name: str
    sample: int
    state: str
    started: bool
    finished: bool
    failed: bool
    activeStage: str
    activeState: str
    startTime: str
    finishedTime: Optional[str]


class DatasetSampleVizData(Schema):
    """Represents the visualization data for a Dataset."""

    nodes: List[Tuple[str, str]]
    edges: Optional[List[Tuple[str, str]]] = None


###############################################################################
# WASAPI Schemas
###############################################################################


class WasapiResponse(Schema):
    """The Wasapi files listing response."""

    count: int
    next: Optional[str]
    previous: Optional[str]
    files: List[str]


###############################################################################
# Private API Endpoints
###############################################################################


@private_api.post("/job/start", response=JobStartOut)
def register_job_start(request, payload: JobStartIn):
    """Tell Keystone a user has started a job."""
    job_type = get_object_or_404(JobType, id=payload.job_type_id)
    username = payload.username
    # Strip any specified "ks:" username prefix.
    user = get_object_or_404(
        User, username=username[3:] if username.startswith("ks:") else username
    )

    # If job is a User-Defined Query, create a Collection to represent the
    # eventual output.
    if job_type != JobType.objects.get(
        id=settings.KnownArchJobUuids.USER_DEFINED_QUERY
    ):
        collection = get_object_or_404(Collection, arch_id=payload.collection_id)
    else:
        job_conf = payload.parameters.conf

        # Parse the collection name and owning user from the outputPath param,
        # which has a format like:
        #  .../{pathsafe_username}/{collection_id}
        # Example:
        #  .../ks-test/SPECIAL-test-collection_1707245569769
        arch_username, arch_collection_id = job_conf.outputPath.rsplit("/", 2)[-2:]
        arch_username = arch_username.replace("-", ":")
        arch_id = f"CUSTOM-{arch_username}:{arch_collection_id}"

        name = job_conf.params.get("name")
        if name is None:
            return HttpResponseBadRequest("Collection name required for UDQ")

        collection = Collection.objects.create(
            arch_id=arch_id,
            name=name,
            collection_type=CollectionTypes.CUSTOM,
            size_bytes=0,
            metadata={"state": JobEventTypes.SUBMITTED},
        )
        collection.accounts.add(user.account)
        collection.users.add(user)

    # Create or update a JobStart instance.
    parameters = payload.parameters.dict()
    if not JobStart.objects.filter(id=payload.id).exists():
        return JobStart.objects.create(
            id=payload.id,
            job_type=job_type,
            collection=collection,
            user=user,
            input_bytes=payload.input_bytes,
            sample=payload.sample,
            parameters=parameters,
            commit_hash=payload.commit_hash,
            created_at=payload.created_at,
        )

    # Note that it's a little confusing that we allow a JobStart
    # (and JobComplete - see register_job_complete()), to be updated given
    # that each instance is supposed to represent a unique job run, but ARCH
    # currently reports the same UUID for jobs submitted via the legacy
    # /api/runjob/:jobid/:collectionid endpoint for:
    #  - the initial run
    #  - additional attempts in the event of run failure
    #  - manual reruns
    # and, the outputs of jobs submitted via the legacy endpoint overwrite/clobber
    # the outputs of any previous run, so it kind of makes sense from Keystone's
    # perspective for these runs to share the same JobStart UUID.
    job_start = JobStart.objects.get(id=payload.id)
    # Return a 400 on fundamental configuration mismatch.
    if (
        job_start.job_type != job_type
        or job_start.collection != collection
        or job_start.sample != payload.sample
    ):
        raise HttpError(
            400,
            f"Payload ({payload}) is incompatible with existing JobStart: "
            f"{model_to_dict(job_start)}",
        )
    # Update the existing object.
    job_start.user = user
    job_start.input_bytes = payload.input_bytes
    job_start.parameters = parameters
    job_start.commit_hash = payload.commit_hash
    job_start.save()

    return job_start


@private_api.post("/job/event", response=JobEventOut)
def register_job_event(request, payload: JobEventIn):
    """Tell Keystone an ARCH job event has occurred"""

    job_start = get_object_or_404(JobStart, id=payload.job_start_id)
    job_event = JobEvent.objects.create(
        job_start=job_start,
        event_type=payload.event_type,
        created_at=payload.created_at,
    )
    return job_event


@private_api.post("/job/complete", response={HTTP_NO_CONTENT: None})
def register_job_complete(request, payload: JobCompleteIn):
    """Tell Keystone a previously registered JobStart has now ended.
    "Complete" does not imply success. The job may have ended in error,
    cancelled by the user, or some other final state.
    """
    job_start = get_object_or_404(JobStart, id=payload.job_start_id)

    # Create or update a JobComplete.
    if not JobComplete.objects.filter(job_start=job_start).exists():
        job_complete = JobComplete.objects.create(
            job_start=job_start,
            output_bytes=payload.output_bytes,
            created_at=payload.created_at,
        )
    else:
        # See the note in register_job_start() as to why we allow JobComplete
        # instances to be updated.
        job_complete = JobComplete.objects.get(job_start=job_start)
        # Maybe update output_bytes.
        if job_complete.output_bytes != payload.output_bytes:
            job_complete.output_bytes = payload.output_bytes
            job_complete.save()
        # Delete any preexisting JobFile objects.
        JobFile.objects.filter(job_complete=job_complete).delete()

    # Abort if job did not finish successfully.
    if job_start.get_job_status().state != JobEventTypes.FINISHED:
        return HTTP_NO_CONTENT, None

    # Create the JobFile objects.
    JobFile.objects.bulk_create(
        [
            JobFile(
                job_complete=job_complete,
                filename=f.filename,
                size_bytes=f.sizeBytes,
                mime_type=f.mimeType,
                line_count=f.lineCount,
                file_type=f.fileType,
                creation_time=f.creationTime,
                md5_checksum=f.md5Checksum,
                access_token=f.accessToken,
            )
            for f in payload.files
        ]
    )

    # Send a finished notification email for dataset and custom collection-type jobs.
    job_type = job_complete.job_start.job_type
    if job_type.can_run:
        jobmail.send_dataset_finished(request, job_complete)
    elif job_type == JobType.objects.get(
        id=settings.KnownArchJobUuids.USER_DEFINED_QUERY
    ):
        jobmail.send_custom_collection_finished(request, job_complete)

    return HTTP_NO_CONTENT, None


# TODO: bulk endpoint for all jobs that can run on a given collection input
@private_api.get("/permission/run_job", response=PermissionResponse)
def user_can_run_job(
    request,
    username: str,
    # job_type_name: str,
    # job_type_version: str,
    # collections: list[str],  # TODO: list[str] makes ninja want a request body
    # estimated_size: int,
):
    """Check if a user can run a given job on a collection.
    Consider:
    - Permissions
    - Quotas
    """
    user = get_object_or_404(User, username=username)
    # job_type = get_object_or_404(JobType, name=job_type_name, version=job_type_version)
    if not user.has_perms(["keystone.add_job_start"]):
        raise HttpError(403, PermissionResponse(allow=False))
    # collections = get_list_or_404(Collection, name__in=collections)
    # quotas = ArchQuota.fetch_for_user(user)

    # TODO: actually implement some checks
    return PermissionResponse(allow=True)


###############################################################################
# Public API Endpoints
###############################################################################


@public_api.get("/collections", response=List[CollectionSchema])
@paginate
def list_collections(request, filters: CollectionFilterSchema = Query(...)):
    """Retrieve a user's Collections, including in-progress and finished, but
    not cancelled or failed, Custom collections."""
    queryset = filters.filter(
        Collection.objects.filter(users=request.user)
        .exclude(
            # Need to do a NULL check first so *__in will work as expected.
            Q(metadata__state__isnull=False)
            & Q(metadata__state__in=(JobEventTypes.CANCELLED, JobEventTypes.FAILED))
        )
        .annotate(dataset_count=Count("jobstart__dataset__id"))
    )
    return apply_sort_param(request, queryset, CollectionSchema)


@public_api.get("/collections/filter_values", response=List[Any])
@paginate
def collections_filter_values(request, field: str):
    """Retrieve the distinct values for a specific Collection field."""
    return get_model_queryset_filter_values(
        Collection.objects.filter(users=request.user),
        field,
        CollectionFilterSchema,
    )


@public_api.get(
    "/collections/{collection_id}/dataset_states", response=List[DatasetSchema]
)
def collection_dataset_states(request, collection_id: int):
    """Retrieve the most recent Dataset of each job type for
    the specified collection."""
    return (
        Dataset.objects.filter(
            job_start__user=request.user,
            job_start__collection_id=collection_id,
            job_start__collection__users=request.user,
        )
        .order_by("job_start__job_type", "job_start__sample", "finished_time")
        .distinct("job_start__job_type", "job_start__sample")
    )


@public_api.get("/datasets", response=List[DatasetSchema])
@paginate
def list_datasets(request, filters: DatasetFilterSchema = Query(...)):
    """Retrieve the list of Datasets"""
    queryset = filters.filter(Dataset.objects.filter(job_start__user=request.user))
    return apply_sort_param(request, queryset, DatasetSchema)


@public_api.get("/datasets/filter_values", response=List[Any])
@paginate
def datasets_filter_values(request, field: str):
    """Retrieve the distinct values for a specific Dataset field."""
    return get_model_queryset_filter_values(
        Dataset.objects.filter(job_start__user=request.user),
        field,
        DatasetFilterSchema,
    )


# Specify int:dataset_id to prevent collision with datasets/generate
@public_api.get("/datasets/{int:dataset_id}", response=DatasetSchema)
def get_dataset(request, dataset_id: int):
    """Retrieve a specific Dataset"""
    return get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)


@public_api.get("/job-categories", response=List[JobCategorySchema])
@paginate
def list_job_categories(request):
    """Retrieve all JobCategory instances."""
    return JobCategory.objects.all()


@public_api.get("/available-jobs", response=List[AvailableJobsCategory])
def list_available_jobs(request):
    """Return the available, user-runnable JobTypes as an object matching
    the response from the ARCH /api/available-jobs endpoint."""

    def cat_img_url(job_cat):
        return static(f"/img/category/{job_cat.name.lower().replace(' ', '-')}.png")

    return [
        {
            "categoryName": job_cat.name,
            "categoryDescription": job_cat.description,
            "categoryImage": cat_img_url(job_cat),
            "categoryId": job_cat.id,
            "jobs": [
                {"id": str(job.id), "name": job.name, "description": job.description}
                for job in job_cat.jobtype_set.filter(can_run=True)
            ],
        }
        for job_cat in (
            JobCategory.objects.filter(jobtype__can_run=True)
            # Filter out ArchiveSpark* jobs for the time being.
            .exclude(
                jobtype__id__in=(
                    settings.KnownArchJobUuids.ARCHIVESPARK_ENTITY_EXTRACTION,
                    settings.KnownArchJobUuids.ARCHIVESPARK_ENTITY_EXTRACTION_CHINESE,
                    settings.KnownArchJobUuids.ARCHIVESPARK_NOOP,
                )
            ).distinct()
        )
    ]


###############################################################################
# Public API -> ARCH Proxy Endpoints
###############################################################################


@public_api.post("/collections/custom", response=JobStateInfo)
def generate_sub_collection(request, payload: SubCollectionCreationRequest):
    """Generate a sub collection"""
    # Pop data.sources, which will either be a string (for a single selection)
    # or an string[] (for multiple selections).
    job_params = {k: v for k, v in dict(payload).items() if v is not None}
    sources = job_params.pop("sources")

    # Convert Keystone ID string-ints to Collection.arch_ids.
    arch_ids = tuple(
        Collection.objects.filter(id__in=sources).values_list("arch_id", flat=True)
    )
    if len(arch_ids) != len(sources):
        raise HttpError(400, "Invalid collection ID(s)")

    # Handle single vs. multiple source collection cases.
    if len(arch_ids) == 1:
        # Specify the single Collection ID as the url param.
        collection_id = arch_ids[0]
    else:
        # Specify the special "UNION-UDQ" Collection ID as the url param.
        collection_id = "UNION-UDQ"
        # Assign arch_ids to data.input which is expected by
        # DerivationJobConf.jobInPath() for Union-type collections.
        job_params["input"] = arch_ids

    return ArchAPI.create_sub_collection(request.user, collection_id, job_params)


@public_api.post("/datasets/generate", response=JobStateInfo)
def generate_dataset(request, payload: DatasetGenerationRequest):
    """Generate a dataset"""
    collection = get_object_or_404(
        Collection, id=payload.collection_id, users=request.user
    )
    job_type = get_object_or_404(JobType, id=payload.job_type_id)
    return ArchAPI.generate_dataset(
        request.user,
        collection.arch_id,
        str(job_type.id),  # Cast UUID to serializable
        payload.is_sample,
        payload.rerun,
    )


@public_api.get("/datasets/{dataset_id}/publication", response=DatasetPublicationInfo)
def dataset_published_status(request, dataset_id: int):
    """Retrieve publication info for the specified Dataset"""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    collection_id = dataset.job_start.collection.arch_id
    job_id = dataset.job_start.job_type.id
    return ArchAPI.get_dataset_publication_info(
        request.user, collection_id, job_id, dataset.job_start.sample
    )


@public_api.post("/datasets/{dataset_id}/publication", response=JobStateInfo)
def publish_dataset(request, dataset_id: int, metadata: DatasetPublicationMetadata):
    """Publish a dataset"""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    collection_id = dataset.job_start.collection.arch_id
    job_id = dataset.job_start.job_type.id
    return ArchAPI.publish_dataset(
        request.user,
        collection_id,
        str(job_id),  # Cast UUID to serializable
        dataset.job_start.sample,
        metadata=metadata.dict(
            exclude_none=True
        ),  # Cast DatasetPublicationMetadata to serializable
    )


@public_api.get(
    "/datasets/{dataset_id}/publication/{item_id}",
    response=DatasetPublicationMetadata,
    exclude_none=True,
)
def get_published_item_metadata(request, dataset_id: int, item_id: str):
    """Retrieve published petabox item metadata for the specified Dataset"""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    collection_id = dataset.job_start.collection.arch_id
    return ArchAPI.get_published_item_metadata(request.user, collection_id, item_id)


@public_api.post(
    "/datasets/{dataset_id}/publication/{item_id}", response={HTTP_NO_CONTENT: None}
)
def update_published_item_metadata(
    request, dataset_id: int, item_id: str, metadata: DatasetPublicationMetadata
):
    """Update the metadata of a published Dataset petabox item"""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    collection_id = dataset.job_start.collection.arch_id
    ArchAPI.update_published_item_metadata(
        request.user, collection_id, item_id, metadata.dict(exclude_none=True)
    )
    return HTTP_NO_CONTENT, None


@public_api.delete(
    "/datasets/{dataset_id}/publication/{item_id}", response={HTTP_ACCEPTED: None}
)
def delete_published_item(request, dataset_id: int, item_id: str):
    """Update the metadata of a published Dataset petabox item"""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    collection_id = dataset.job_start.collection.arch_id
    ArchAPI.delete_published_item(request.user, collection_id, item_id)
    return HTTP_ACCEPTED, None


@public_api.get("/datasets/{dataset_id}/sample_viz_data", response=DatasetSampleVizData)
def get_sample_viz_data(request, dataset_id: int):
    """Get the sample visualization data for the specific dataset."""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    return ArchAPI.get_dataset_sample_viz_data(
        request.user, ArchAPI.get_arch_dataset_id(dataset)
    )


###############################################################################
# WASAPI Endpoints
###############################################################################


@wasapi_api.get(
    "/jobs/{dataset_id}/result", url_name="file_listing", response=WasapiResponse
)
def get_file_listing(request, dataset_id: int):
    """Proxy as WASAPI datase file listing response from ARCH."""
    dataset = get_object_or_404(Dataset, id=dataset_id)

    return ArchAPI.proxy_wasapi_request(
        request.user,
        dataset.job_start.collection.arch_id,
        dataset.job_start.job_type.id,
        dataset.job_start.sample,
    )
