from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema, ModelSchema
from ninja.security import APIKeyHeader, django_auth

from config import settings
from .models import Collection, CollectionTypes, JobComplete, JobStart, JobType, User


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


# Ninja requires distinct `urls_namespace` or `version` args for each NinjaAPI object.
# If csrf is on, Ninja will require it even if using APIKeyHeader.
public_api = NinjaAPI(urls_namespace="public", csrf=True, auth=[django_auth])
private_api = NinjaAPI(urls_namespace="private", auth=[ApiKey()])


class CollectionIn(ModelSchema):
    """Request POST payload schema for registering Collections"""

    collection_type: CollectionTypes

    class Config:
        """Ninja ModelSchema configuration."""

        model = Collection
        model_fields = ["name"]


@private_api.post("/collection")
def register_collection(request, collection: CollectionIn):
    """Tell Keystone about a collection"""
    coll = Collection.objects.create(**collection.dict())
    return {"id": coll.id}


class JobStartIn(Schema):
    """Request POST payload schema for JobStart registration"""

    job_type_name: str
    job_type_version: str
    username: str
    estimated_input_bytes: int
    parameters: str


class JobStartOut(ModelSchema):
    """Response schema for JobStart registration."""

    class Config:
        """Ninja ModelSchema configuration."""

        model = JobStart
        model_fields = [
            "id",
            "job_type",
            "user",
            "estimated_input_bytes",
            "parameters",
            "created_at",
        ]


@private_api.post("/job/start", response=JobStartOut)
def register_job_start(request, payload: JobStartIn):
    """Tell Keystone a user has started a job."""
    job_type = get_object_or_404(
        JobType, name=payload.job_type_name, version=payload.job_type_version
    )
    user = get_object_or_404(User, username=payload.username)
    job_start = JobStart.objects.create(
        job_type=job_type,
        user=user,
        estimated_input_bytes=payload.estimated_input_bytes,
        parameters=payload.parameters,
    )
    return job_start


class JobCompleteIn(Schema):
    """Request POST payload schema for JobComplete registration"""

    job_id: int
    input_bytes: int
    output_bytes: int


class JobCompleteOut(ModelSchema):
    """Response schema for JobComplete registration"""

    class Config:
        """Ninja ModelSchema configuration."""

        model = JobComplete
        model_fields = ["id", "job_start", "input_bytes", "output_bytes", "created_at"]


@private_api.post("/job/complete", response=JobCompleteOut)
def register_job_complete(request, payload: JobCompleteIn):
    """Tell Keystone a previously registered JobStart has now ended.
    "Complete" does not imply success. The job may have ended in error,
    cancelled by the user, or some other final state.
    """
    job_start = get_object_or_404(JobStart, id=payload.job_id)
    job_complete = JobComplete.objects.create(
        job_start=job_start,
        input_bytes=payload.input_bytes,
        output_bytes=payload.output_bytes,
    )
    return job_complete


class PermissionResponse(Schema):
    """Response schema for Keystone permission requests"""

    allow: bool


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
        return 403, PermissionResponse(allow=False)
    # collections = get_list_or_404(Collection, name__in=collections)
    # quotas = ArchQuota.fetch_for_user(user)

    # TODO: actually implement some checks
    return 200, PermissionResponse(allow=True)
