from django.shortcuts import get_list_or_404, get_object_or_404
from ninja import NinjaAPI, Schema, ModelSchema
from ninja.security import APIKeyHeader, django_auth

from config import settings
from .models import Collection, CollectionTypes, JobComplete, JobStart, JobType, User


class ApiKey(APIKeyHeader):
    param_name = "X-API-Key"

    def authenticate(self, request, key):
        if key == settings.PRIVATE_API_KEY:
            return key


# Ninja requires distinct `urls_namespace` or `version` args for each NinjaAPI object.
# If csrf is on, Ninja will require it even if using APIKeyHeader.
public_api = NinjaAPI(urls_namespace="public", csrf=True, auth=[django_auth])
private_api = NinjaAPI(urls_namespace="private", auth=[ApiKey()])


class CollectionIn(ModelSchema):
    collection_type: CollectionTypes

    class Config:
        model = Collection
        model_fields = ["name"]


@private_api.post("/collection")
def register_collection(request, collection: CollectionIn):
    coll = Collection.objects.create(**collection.dict())
    return {"id": coll.id}


class JobStartIn(Schema):
    job_type_name: str
    job_type_version: str
    username: str
    estimated_input_bytes: int
    parameters: str


class JobStartOut(ModelSchema):
    class Config:
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
    job_id: int
    input_bytes: int
    output_bytes: int


class JobCompleteOut(ModelSchema):
    class Config:
        model = JobComplete
        model_fields = ["id", "job_start", "input_bytes", "output_bytes", "created_at"]


@private_api.post("/job/complete", response=JobCompleteOut)
def register_job_complete(request, payload: JobCompleteIn):
    job_start = get_object_or_404(JobStart, id=payload.job_id)
    job_complete = JobComplete.objects.create(job_start=job_start, input_bytes=payload.input_bytes, output_bytes=payload.output_bytes)
    return job_complete


class PermissionResponse(Schema):
    allow: bool
    message: str


# TODO: bulk endpoint for all jobs that can run on a given collection input
@private_api.get("/permission/run_job", response=PermissionResponse)
def user_can_run_job(
    request,
    username: str,
    job_type_name: str,
    job_type_version: str,
    # collections: list[str],  # TODO: list[str] makes ninja want a request body
    estimated_size: int,
):
    user = get_object_or_404(User, username=username)
    job_type = get_object_or_404(JobType, name=job_type_name, version=job_type_version)
    # collections = get_list_or_404(Collection, name__in=collections)
    # TODO: actually implement some checks
    return PermissionResponse(allow=True, message="Allowed")
