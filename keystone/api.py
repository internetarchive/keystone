# pylint: disable=too-many-lines

import re
from collections import defaultdict
from datetime import datetime
from functools import wraps
from http import HTTPStatus
from typing import (
    Any,
    List,
    Optional,
    Tuple,
)

from uuid import UUID

import django.utils
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.postgres.aggregates import ArrayAgg
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.db import IntegrityError, OperationalError, transaction
from django.db.models import Count, Exists, OuterRef, Q, QuerySet, Subquery
from django.db.models.functions import Coalesce
from django.templatetags.static import static
from django.utils.datastructures import MultiValueDict
from django.http import (
    Http404,
    HttpRequest,
    HttpResponse,
    HttpResponseBadRequest,
    JsonResponse,
)
from ninja.errors import HttpError
from ninja.pagination import paginate
from ninja.parser import Parser
from ninja.types import DictStrAny
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
from pydantic import PositiveInt


from config.settings import (
    ARCH_GLOBAL_USERNAME,
    ARCH_SUPPORT_TICKET_URL,
    GLOBAL_USER_USERNAME,
    PUBLIC_BASE_URL,
    PRIVATE_API_KEY,
    KnownArchJobUuids,
)

from . import jobmail
from .arch_api import (
    ArchAPI,
    ArchRequestError,
)
from .context_processors import helpers as ctx_helpers
from .jobmail import send as send_email
from .helpers import (
    dot_to_dunder,
    find_field_from_lookup,
    report_exceptions,
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
    Team,
    User,
    UserRoles,
)


###############################################################################
# Constants
###############################################################################


UNIQUE_INTEGRITY_ERROR_REGEX = re.compile(r"Key \((.+)\)=\((.+)\) already exists")

MAX_USERS_INTEGRITY_ERROR_REGEX = re.compile(
    r"Account \((\d+)\) has reached its max users limit"
)


###############################################################################
# Custom Exceptions
###############################################################################


class PermissionDenied(HttpError):
    """A Ninja-friendly Django PermissionDenied exception."""

    def __init__(self, message="FORBIDDEN"):
        super().__init__(HTTPStatus.FORBIDDEN, message)


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
        if key == PRIVATE_API_KEY:
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
# Decorators
###############################################################################


def require_admin(func):
    """Route decorator to enforce user.role == ADMIN"""

    @wraps(func)
    def wrapper(request, *args, **kwargs):
        if request.user.role != UserRoles.ADMIN:
            raise PermissionDenied
        return func(request, *args, **kwargs)

    return wrapper


###############################################################################
# Request Helpers
###############################################################################


class KeystoneRequestParser(Parser):
    """Override default querydict parser to convert dot-delimited model
    field references to the double-underscore delimited references that Django
    expects.
    """

    def parse_querydict(
        self, data: MultiValueDict, list_fields: List[str], request: HttpRequest
    ) -> DictStrAny:
        result: DictStrAny = {}
        for key in data.keys():
            final_key = dot_to_dunder(key)
            if final_key in list_fields:
                result[final_key] = data.getlist(key)
            else:
                result[final_key] = data[key]
        return result


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


@public_api.exception_handler(ArchRequestError)
def public_api_arch_request_error_handler(request, exc):
    """Convert ArchRequestErrors to HTTP responses."""
    return exc.to_http_response()


@public_api.exception_handler(IntegrityError)
def public_api_integrityerror_error_handler(request, exc):
    """Convert IntegrityErrors to JSON responses."""

    def make_response(details):
        return JsonResponse({"details": details}, status=400)

    # Check for unique constraint violation.
    match = UNIQUE_INTEGRITY_ERROR_REGEX.search(exc.args[0])
    if match:
        field, value = match.groups()
        if "," in field:
            values = tuple(value.split(", "))
            fields = tuple(field.split(", "))
            return make_response(f"values {values} already exists for fields {fields}")
        return make_response(f"value ({value}) already exists for field ({field})")
    # Check for account max users check violation.
    match = MAX_USERS_INTEGRITY_ERROR_REGEX.search(exc.args[0])
    if match:
        return make_response("Account has reached its max users limit")
    return make_response("Unhandled IntegrityError")


@public_api.exception_handler(OperationalError)
def public_api_operationalerror_error_handler(request, exc):
    """Convert expected OperationalErrors (i.e. those that we explicitly raise
    from within DB triggers) to JSON responses."""
    # Get the first line of the detail string.
    exc_detail = exc.args[0].split("\n")[0]
    if exc_detail == "account max users limit reached" or " is immutable" in exc_detail:
        return JsonResponse({"details": exc_detail}, status=400)
    return HttpResponse(status=HTTPStatus.INTERNAL_SERVER_ERROR)


@public_api.exception_handler(ObjectDoesNotExist)
def public_api_objectdoesnotexist_error_handler(request, exc):
    """Convert Model.DoesNotExist to a HTTP 404 response."""
    # pylint: disable=unused-argument
    return HttpResponse("Not Found", status=HTTPStatus.NOT_FOUND)


private_api = NinjaAPI(
    urls_namespace="private", auth=[ApiKey()], parser=KeystoneRequestParser()
)


wasapi_api = NinjaAPI(
    urls_namespace="wasapi",
    csrf=True,
    auth=[django_auth, BasicAuth()],
)


@wasapi_api.exception_handler(ArchRequestError)
def wasapi_api_arch_request_error_handler(request, exc):
    """Convert ArchRequestErrors to HTTP responses."""
    return exc.to_http_response()


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
    username: str
    input_bytes: PositiveInt
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
    dataset_count: int = 0
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
    collection_access: bool
    is_sample: bool = Field(..., alias="job_start.sample")
    job_id: UUID = Field(..., alias="job_start.job_type.id")
    category_name: str = Field(..., alias="job_start.job_type.category.name")
    name: str = Field(..., alias="job_start.job_type.name")
    state: str
    start_time: datetime
    finished_time: Optional[datetime]
    team_ids: List[int]


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
    info_url: str
    code_url: str
    parameters_schema: Optional[dict]


class AvailableJobsCategory(Schema):
    """A category of available Dataset generation jobs."""

    categoryName: str
    categoryDescription: str
    categoryImage: str
    categoryId: int
    jobs: List[AvailableJob]


class MinimalUserSchema(Schema):
    """Represents a minial user."""

    id: int
    username: str


class TeamSchema(Schema):
    """Represents a Team."""

    id: int
    name: str
    members: List[MinimalUserSchema]


class MinimalTeamSchema(Schema):
    """Represents a minimal Team."""

    id: int
    name: str


class CreateTeamSchema(Schema):
    """New Team creation schema"""

    account_id: int
    name: str


class UpdateTeamSchema(Schema):
    """Existing Team update schema"""

    name: Optional[str]
    members: Optional[List[MinimalUserSchema]]


class TeamFilterSchema(FilterSchema):
    """Team filters"""

    # Suppress "Method 'custom_expression' is abstract in class 'FilterSchema' ..."
    # pylint: disable=abstract-method

    search: Optional[str] = Field(
        None, q=["name__icontains", "members__username__icontains"]
    )


class UserSchema(Schema):
    """User schema"""

    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    role: UserRoles
    date_joined: datetime
    last_login: datetime = None
    teams: List[MinimalTeamSchema]


class CreateUserSchema(Schema):
    """New User creation schema"""

    account_id: int
    username: str
    first_name: str
    last_name: str
    email: str
    role: UserRoles
    teams: List[MinimalTeamSchema]


class UpdateUserSchema(Schema):
    """Existing User update schema"""

    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    role: Optional[UserRoles]
    teams: Optional[List[MinimalTeamSchema]]

    class Config:
        """Reject any requests that specify username."""

        extra = "forbid"


class UserFilterSchema(FilterSchema):
    """User filters"""

    # Suppress "Method 'custom_expression' is abstract in class 'FilterSchema' ..."
    # pylint: disable=abstract-method

    search: Optional[str] = Field(
        None,
        q=[
            "username__icontains",
            "first_name__icontains",
            "last_name__icontains",
            "email__icontains",
        ],
    )

    # In order to support multiple query values for a single field,
    # use type of Optional[List[T]] and a Field q value like "...__in".
    role: Optional[List[UserRoles]] = Field(None, q="role__in")


###############################################################################
# Public API ARCH Proxy Schemas
###############################################################################


class DatasetPublicationInfo(Schema):
    """Information about a published Dataset"""

    item: str
    inputId: str
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


class GlobalJobParameters(Schema):
    """Configuration parameters common to all jobs."""

    sample: bool


class NamedEntityExtractionParameters(GlobalJobParameters):
    """NamedEntityExtraction-specific job configuration parameters."""

    lang: str


class DatasetGenerationRequest(Schema):
    """Request POST payload schema for Dataset generation."""

    collection_id: int
    job_type_id: str
    params: NamedEntityExtractionParameters | GlobalJobParameters


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
    startTime: Optional[str]
    finishedTime: Optional[str]


class DatasetSampleVizData(Schema):
    """Represents the visualization data for a Dataset."""

    nodes: List[Tuple[str, str]]
    edges: Optional[List[Tuple[str, str]]] = None


###############################################################################
# WASAPI Schemas
###############################################################################


class WasapiResponseFile(Schema):
    """The Wasapi files listing response file schema."""

    checksums: dict[str, str]
    collection: str
    filename: str
    filetype: str
    locations: List[str]
    size: int


class WasapiResponse(Schema):
    """The Wasapi files listing response."""

    count: int
    next: Optional[str]
    previous: Optional[str]
    files: List[WasapiResponseFile]


###############################################################################
# Private API Endpoints
###############################################################################


@private_api.post("/job/start", response=JobStartOut)
@report_exceptions(Http404)
@transaction.atomic
def register_job_start(request, payload: JobStartIn):
    """Tell Keystone a user has started a job."""
    job_type = get_object_or_404(JobType, id=payload.job_type_id)
    username = payload.username
    # Maybe retrieve the global dataset user, or strip any "ks:" username
    # prefix.
    if username == ARCH_GLOBAL_USERNAME:
        username = GLOBAL_USER_USERNAME
    elif username.startswith("ks:"):
        username = username[3:]
    user = get_object_or_404(User, username=username)

    parameters = payload.parameters

    # If this is a retry, as indicated by attempt > 1, update the existing attempt
    # count and return.
    current_attempt = parameters.attempt
    if current_attempt > 1:
        # In the event of a retry, update the existing JobStart's attempt count.
        job_start = JobStart.objects.get(id=payload.id)
        # Raise an error if the current attempt would not decrement the existing.
        previous_attempt = job_start.parameters["attempt"]
        if current_attempt <= previous_attempt:
            raise HttpError(
                400,
                f"Can not update job ({job_start.id}) attempt count from "
                f"({previous_attempt}) to ({current_attempt}) - value can only be incremented",
            )
        job_start.parameters["attempt"] = current_attempt
        job_start.save()
        return job_start

    #
    # This is the first job run attempt.
    #

    # If job is not a User-Defined Query, lookup the collection from the
    # provided inputSpec, otherwise create a new Collection to serve as the
    # job_start.collection value.
    if job_type.id != KnownArchJobUuids.USER_DEFINED_QUERY:
        try:
            collection = Collection.get_for_input_spec(parameters.conf.inputSpec)
        except Collection.DoesNotExist as e:
            raise Http404 from e
    else:
        job_conf = parameters.conf

        # Parse the collection name and owning user from the outputPath param,
        # which has a format like:
        #  .../{pathsafe_username}/{collection_id}
        # or
        #  .../{uuid_outpath}/{uuid}
        # Example:
        #  .../ks-test/SPECIAL-test-collection_1707245569769
        _, arch_collection_id = job_conf.outputPath.rsplit("/", 2)[-2:]
        arch_id = f"CUSTOM-{arch_collection_id}"

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
        # Grant user and user-account level collection access.
        collection.accounts.add(user.account)
        collection.users.add(user)

    return JobStart.objects.create(
        id=payload.id,
        job_type=job_type,
        collection=collection,
        user=user,
        input_bytes=payload.input_bytes,
        sample=payload.sample,
        parameters=parameters.dict(),
        commit_hash=payload.commit_hash,
        created_at=payload.created_at,
    )


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


@private_api.post("/job/complete", response={HTTPStatus.NO_CONTENT: None})
@report_exceptions(Http404)
def register_job_complete(request, payload: JobCompleteIn):
    """Tell Keystone a previously registered JobStart has now ended.
    "Complete" does not imply success. The job may have ended in error,
    cancelled by the user, or some other final state.
    """
    job_start = get_object_or_404(JobStart, id=payload.job_start_id)

    # Get (in the event of a retry) or create a JobComplete.
    if job_start.parameters["attempt"] > 1:
        job_complete = JobComplete.objects.get(job_start=job_start)
        # Maybe update output_bytes.
        if job_complete.output_bytes != payload.output_bytes:
            job_complete.output_bytes = payload.output_bytes
            job_complete.save()
    else:
        job_complete = JobComplete.objects.create(
            job_start=job_start,
            output_bytes=payload.output_bytes,
            created_at=payload.created_at,
        )

    # Abort if job did not finish successfully.
    if job_start.get_job_status().state != JobEventTypes.FINISHED:
        return HTTPStatus.NO_CONTENT, None

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
    elif job_type.id == KnownArchJobUuids.USER_DEFINED_QUERY:
        jobmail.send_custom_collection_finished(request, job_complete)

    return HTTPStatus.NO_CONTENT, None


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
    # https://stackoverflow.com/a/65613047
    datasets_count_subquery = Subquery(
        Dataset.user_queryset(request.user)
        .filter(job_start__collection__id=OuterRef("id"), state=JobEventTypes.FINISHED)
        .order_by()
        .values("job_start__collection__id")
        .annotate(count=Count("id", distinct=True))
        .values("count")
    )

    queryset = filters.filter(
        Collection.user_queryset(request.user)
        .exclude(
            # Need to do a NULL check first so *__in will work as expected.
            Q(metadata__state__isnull=False)
            & Q(metadata__state__in=(JobEventTypes.CANCELLED, JobEventTypes.FAILED))
        )
        .annotate(dataset_count=Coalesce(datasets_count_subquery, 0))
    )
    collections = list(apply_sort_param(request, queryset, CollectionSchema))

    # Set latest_dataset.
    ordered_datasets = list(
        Dataset.user_queryset(request.user)
        .prefetch_related("job_start")
        .prefetch_related("job_start__job_type")
        .prefetch_related("job_start__collection")
        .filter(job_start__collection__in=collections, state=JobEventTypes.FINISHED)
        .order_by("-finished_time")
    )
    collection_datasets_map = defaultdict(list)
    for dataset in ordered_datasets:
        collection_datasets_map[dataset.job_start.collection.id].append(dataset)
    for c in collections:
        datasets = collection_datasets_map[c.id]
        c.latest_dataset = None if not datasets else datasets[0]

    return collections


@public_api.get("/collections/filter_values", response=List[Any])
@paginate
def collections_filter_values(request, field: str):
    """Retrieve the distinct values for a specific Collection field."""
    return get_model_queryset_filter_values(
        Collection.user_queryset(request.user),
        field,
        CollectionFilterSchema,
    )


@public_api.get("/collections/{collection_id}/dataset_states", response=dict)
def collection_dataset_states(request, collection_id: int):
    """Retrieve a collection's stats for each dataset type as a dicts in the format:
    {
      "{JobType.id}": [
        [ {dataset_id}, {most_recent_dataset_start_time}, {dataset_state} ],
        [ {dataset_id}, {next_most_recent_dataset_start_time}, {dataset_state} ],
        ...
      ],
      ...
    }
    """
    collection = get_object_or_404(
        Collection.user_queryset(request.user), id=collection_id
    )
    datasets = (
        Dataset.user_queryset(request.user)
        .filter(
            job_start__collection_id=collection,
        )
        .order_by("-start_time")
        .all()
    )

    # I tried to use Django to do this grouping but...too....difficult...
    d = defaultdict(list)
    for dataset in datasets:
        d[str(dataset.job_start.job_type.id)].append(
            (dataset.id, dataset.start_time, dataset.state)
        )
    return d


@public_api.get("/datasets", response=List[DatasetSchema])
@paginate
def list_datasets(request, filters: DatasetFilterSchema = Query(...)):
    """Retrieve the list of Datasets"""
    queryset = filters.filter(
        Dataset.user_queryset(request.user)
        .prefetch_related("job_start")
        .prefetch_related("job_start__job_type")
        .prefetch_related("job_start__job_type__category")
        .prefetch_related("job_start__collection")
        .annotate(team_ids=ArrayAgg("teams__id", filter=Q(teams__id__isnull=False)))
        .annotate(
            collection_access=Exists(
                Collection.user_queryset(request.user).filter(
                    id=OuterRef("job_start__collection__id")
                )
            )
        )
    )
    return apply_sort_param(request, queryset, DatasetSchema)


@public_api.get("/datasets/filter_values", response=List[Any])
@paginate
def datasets_filter_values(request, field: str):
    """Retrieve the distinct values for a specific Dataset field."""
    return get_model_queryset_filter_values(
        Dataset.user_queryset(request.user),
        field,
        DatasetFilterSchema,
    )


# Specify int:dataset_id to prevent collision with datasets/generate
@public_api.get("/datasets/{int:dataset_id}", response=DatasetSchema)
def get_dataset(request, dataset_id: int):
    """Retrieve a specific Dataset"""
    return get_object_or_404(
        Dataset.user_queryset(request.user)
        .prefetch_related("job_start")
        .prefetch_related("job_start__job_type")
        .prefetch_related("job_start__job_type__category")
        .prefetch_related("job_start__collection")
        .annotate(team_ids=ArrayAgg("teams__id", filter=Q(teams__id__isnull=False)))
        .annotate(
            collection_access=Exists(
                Collection.user_queryset(request.user).filter(
                    id=OuterRef("job_start__collection__id")
                )
            )
        ),
        id=dataset_id,
    )


# Specify int:dataset_id to prevent collision with datasets/generate
@public_api.post(
    "/datasets/{int:dataset_id}/teams",
    response={HTTPStatus.NO_CONTENT: None},
)
def update_dataset_teams(request, dataset_id: int, payload: List[MinimalTeamSchema]):
    """Retrieve a specific Dataset"""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Only the dataset owner is allowed to update teams.
    if request.user != dataset.job_start.user:
        raise PermissionDenied
    # Check that the user is a member of all the specified teams.
    team_ids = set(t.id for t in payload)
    bad_teams = team_ids - set(request.user.teams.values_list("id", flat=True))
    if bad_teams:
        raise HttpError(400, f"Invalid team ID(s): {list(bad_teams)}")
    # Do the update.
    dataset.teams.set(Team.objects.filter(id__in=team_ids))
    return HTTPStatus.NO_CONTENT, None


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

    exclude_job_uuids = (
        # Legacy NamedEntities is replaced by ArchiveSparkEntityExtraction
        KnownArchJobUuids.NAMED_ENTITIES,
        KnownArchJobUuids.ARCHIVESPARK_ENTITY_EXTRACTION_CHINESE,
        KnownArchJobUuids.ARCHIVESPARK_NOOP,
    )

    return [
        {
            "categoryName": job_cat.name,
            "categoryDescription": job_cat.description,
            "categoryImage": cat_img_url(job_cat),
            "categoryId": job_cat.id,
            "jobs": [
                {
                    "id": str(job.id),
                    "name": job.name,
                    "description": job.description,
                    "info_url": job.info_url,
                    "code_url": job.code_url,
                    "parameters_schema": job.parameters_schema,
                }
                for job in job_cat.jobtype_set.filter(can_run=True).exclude(
                    id__in=exclude_job_uuids
                )
            ],
        }
        for job_cat in (JobCategory.objects.exclude(name__in=("System", "")))
    ]


@public_api.get("/users", response=List[UserSchema])
@paginate
@require_admin
def list_account_users(request, filters: UserFilterSchema = Query(...)):
    """Return the users that are members of the requesting ADMIN-type user's
    account."""
    queryset = filters.filter(User.objects.filter(account=request.user.account))
    return apply_sort_param(request, queryset, UserSchema)


@public_api.get("/users/filter_values", response=List[Any])
@paginate
def users_filter_values(request, field: str):
    """Retrieve the distinct values for a specific User field."""
    return get_model_queryset_filter_values(
        User.objects.filter(account=request.user.account),
        field,
        UserFilterSchema,
    )


@public_api.get("/users/{user_id}", response=UserSchema)
def get_user(request, user_id: int):
    """Return a single User."""
    req_user = request.user
    if req_user.role != UserRoles.ADMIN and user_id != req_user.id:
        raise PermissionDenied
    return User.objects.filter(account=req_user.account).get(id=user_id)


@public_api.put("/users", response={HTTPStatus.CREATED: UserSchema})
@require_admin
@transaction.atomic
def create_user(request, payload: CreateUserSchema, send_welcome: bool):
    """Create a new User."""
    # Deny if the requesting and target user accounts are not the same.
    if payload.account_id != request.user.account_id:
        raise PermissionDenied
    payload_d = payload.dict()
    teams = payload_d.pop("teams", ())
    new_user = User.objects.create(**payload_d)
    # Handle "teams".
    new_user.teams.set(Team.objects.filter(id__in={t["id"] for t in teams}))
    # Maybe send welcome email.
    if send_welcome:
        send_email(
            "new_user_welcome_email",
            context={
                "user": new_user,
                "base_url": PUBLIC_BASE_URL,
                "uid": django.utils.http.urlsafe_base64_encode(
                    django.utils.encoding.force_bytes(new_user.id)
                ),
                "token": PasswordResetTokenGenerator().make_token(new_user),
                "arch_support_ticket_url": ARCH_SUPPORT_TICKET_URL,
            },
            subject="Welcome to ARCH!",
            to=new_user.email,
        )
    return HTTPStatus.CREATED, new_user


@public_api.patch("/users/{user_id}", response=UserSchema)
def update_user(request, payload: UpdateUserSchema, user_id: int):
    """Update an existing User."""
    req_user = request.user
    req_user_is_admin = req_user.role == UserRoles.ADMIN
    # Deny request if not admin or target is not self.
    if not req_user_is_admin and user_id != req_user.id:
        raise PermissionDenied
    existing_user = User.objects.get(id=user_id)
    # Deny if the requesting and target user accounts are not the same.
    if existing_user.account_id != req_user.account_id:
        raise PermissionDenied
    updated = False
    for k, v in payload.dict(exclude_none=True).items():
        if getattr(existing_user, k) != v:
            # A user is not allowed to modify their own role.
            if k == "role" and existing_user == req_user:
                raise PermissionDenied("self role modification not allowed")
            # Handle "teams".
            if k == "teams":
                team_ids = {x["id"] for x in v}
                if team_ids != set(existing_user.teams.values_list("id", flat=True)):
                    if req_user_is_admin:
                        existing_user.teams.set(Team.objects.filter(id__in=team_ids))
                    else:
                        raise PermissionDenied(
                            "only account admins can update user teams"
                        )
            else:
                setattr(existing_user, k, v)
                updated = True
    if updated:
        existing_user.save()

    return existing_user


@public_api.get("/teams", response=List[TeamSchema])
@paginate
def list_account_teams(request, filters: TeamFilterSchema = Query(...)):
    """Return the teams that are members of the requesting ADMIN-type user's
    account."""
    queryset = filters.filter(
        Team.objects.filter(account=request.user.account).prefetch_related("members")
    )
    return apply_sort_param(request, queryset, TeamSchema)


@public_api.put("/teams", response={HTTPStatus.CREATED: TeamSchema})
@require_admin
def create_team(request, payload: CreateTeamSchema):
    """Create a new Team."""
    # Deny if the requesting and target user accounts are not the same.
    if payload.account_id != request.user.account_id:
        raise PermissionDenied
    new_team = Team.objects.create(**payload.dict())
    return HTTPStatus.CREATED, new_team


@public_api.patch("/teams/{team_id}", response=TeamSchema)
def update_team(request, payload: UpdateTeamSchema, team_id: int):
    """Update an existing Team."""
    req_user = request.user
    # Deny request if not admin or target is not self.
    if req_user.role != UserRoles.ADMIN:
        raise PermissionDenied
    existing_team = Team.objects.get(id=team_id)
    # Deny if the requesting and target accounts are not the same.
    if existing_team.account_id != req_user.account_id:
        raise PermissionDenied
    payload_d = payload.dict()
    # Handle 'name'.
    name = payload_d.get("name")
    if name and name != existing_team.name:
        existing_team.name = payload.name
        existing_team.save()
    # Handle 'members'.
    members = payload_d.get("members")
    if members is not None:
        member_ids = {x["id"] for x in members}
        if member_ids != set(existing_team.members.values_list("id", flat=True)):
            existing_team.members.set(User.objects.filter(id__in=member_ids))
    return existing_team


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

    collections = list(Collection.user_queryset(request.user).filter(id__in=sources))
    if len(collections) != len(sources):
        raise HttpError(400, "Invalid collection ID(s)")

    # Handle single vs. multiple source collection cases.
    input_spec = (
        collections[0].input_spec
        if (len(collections) == 1)
        else {"type": "multi-specs", "specs": [c.input_spec for c in collections]}
    )

    return ArchAPI.create_sub_collection(request.user, input_spec, job_params)


@public_api.post("/datasets/generate", response=JobStateInfo)
def generate_dataset(request, payload: DatasetGenerationRequest):
    """Generate a dataset"""
    collection = get_object_or_404(
        Collection.user_queryset(request.user), id=payload.collection_id
    )
    job_type = get_object_or_404(JobType, id=payload.job_type_id)

    return ArchAPI.generate_dataset(
        request.user,
        collection.input_spec,
        str(job_type.id),  # Cast UUID to serializable
        payload.params.dict(),
    )


@public_api.get("/datasets/{dataset_id}/publication", response=DatasetPublicationInfo)
def dataset_published_status(request, dataset_id: int):
    """Retrieve publication info for the specified Dataset"""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Request on behalf of the Dataset owner in the event of teammate access.
    res = ArchAPI.get_dataset_publication_info(
        dataset.job_start.user, dataset.job_start.id
    )
    return res


@public_api.post("/datasets/{dataset_id}/publication", response=JobStateInfo)
def publish_dataset(request, dataset_id: int, metadata: DatasetPublicationMetadata):
    """Publish a dataset"""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Only the dataset owner is allowed to publish.
    if request.user != dataset.job_start.user:
        raise PermissionDenied
    return ArchAPI.publish_dataset(
        request.user,
        {"type": "dataset", "uuid": str(dataset.job_start.id)},
        metadata=metadata.dict(
            exclude_none=True
        ),  # Cast DatasetPublicationMetadata to serializable
    )


@public_api.get(
    "/datasets/{dataset_id}/publication/metadata",
    response=DatasetPublicationMetadata,
    exclude_none=True,
)
def get_published_item_metadata(request, dataset_id: int):
    """Retrieve published petabox item metadata for the specified Dataset"""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Request on behalf of the Dataset owner in the event of teammate access.
    return ArchAPI.get_published_item_metadata(
        dataset.job_start.user, dataset.job_start.id
    )


@public_api.post(
    "/datasets/{dataset_id}/publication/metadata",
    response={HTTPStatus.NO_CONTENT: None},
)
def update_published_item_metadata(
    request, dataset_id: int, metadata: DatasetPublicationMetadata
):
    """Update the metadata of a published Dataset petabox item"""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Only the dataset owner is allowed to update metadata.
    if request.user != dataset.job_start.user:
        raise PermissionDenied
    ArchAPI.update_published_item_metadata(
        request.user, dataset.job_start.id, metadata.dict(exclude_none=True)
    )
    return HTTPStatus.NO_CONTENT, None


@public_api.delete(
    "/datasets/{dataset_id}/publication", response={HTTPStatus.ACCEPTED: None}
)
def delete_published_item(request, dataset_id: int):
    """Update the metadata of a published Dataset petabox item"""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Only the dataset owner is allowed to delete the item.
    if request.user != dataset.job_start.user:
        raise PermissionDenied
    ArchAPI.delete_published_item(request.user, dataset.job_start.id)
    return HTTPStatus.ACCEPTED, None


@public_api.get("/datasets/{dataset_id}/sample_viz_data", response=DatasetSampleVizData)
def get_sample_viz_data(request, dataset_id: int):
    """Get the sample visualization data for the specific dataset."""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Request on behalf of the Dataset owner in the event of teammate access.
    return ArchAPI.get_dataset_sample_viz_data(
        dataset.job_start.user, dataset.job_start.id
    )


###############################################################################
# WASAPI Endpoints
###############################################################################


@wasapi_api.get(
    "/jobs/{dataset_id}/result", url_name="file_listing", response=WasapiResponse
)
def get_file_listing(request, dataset_id: PositiveInt, page: PositiveInt = 1):
    """Proxy as WASAPI datase file listing response from ARCH."""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Use the reverse for dataset-file-download to create a base download URL, to
    # which ARCH will append "/{filename}?access=..."
    base_download_url = ctx_helpers(request)["abs_url"](
        "dataset-file-download", args=[dataset.id, "dummy"]
    ).rsplit("/", 1)[0]
    # Request on behalf of the Dataset owner in the event of teammate access.
    res = ArchAPI.list_wasapi_files(
        dataset.job_start.user,
        dataset.job_start.id,
        base_download_url,
        page,
    )
    # Rewrite next/previous URLs to Keystone-specific values.
    base_abs_url = ctx_helpers(request)["abs_url"](
        "wasapi:file_listing", args=[dataset_id]
    )
    if res.get("next"):
        res["next"] = f"{base_abs_url}?page={page + 1}"
    if res.get("previous"):
        res["previous"] = f"{base_abs_url}?page={page - 1}"
    return res
