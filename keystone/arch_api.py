# pylint: disable=too-many-arguments

from dataclasses import dataclass
from http import HTTPStatus
from json import JSONDecodeError
from logging import getLogger

import requests
from django.utils.http import content_disposition_header
from django.http import (
    Http404,
    HttpResponse,
    StreamingHttpResponse,
)

from config import settings


JSON = "true"

log = getLogger()


@dataclass
class ArchRequestError(Exception):
    """ARCH API Request Exception"""

    # pylint: disable=too-many-instance-attributes

    base_url: str
    method: str
    username: str
    path: str
    params: dict
    data: dict
    status_code: int
    msg: str

    def to_http_response(self):
        """Log the exception and convert it to an HttpResponse object."""
        log.exception(self)
        return HttpResponse(self.msg, status=self.status_code)


class ArchAPI:
    """ARCH API Interface"""

    @classmethod
    def encode_param_value(cls, v):
        """Encode an ARCH query param value."""
        if v is True:
            return "true"
        if v is False:
            return "false"
        return v

    @classmethod
    def request(
        cls,
        method,
        user,
        path,
        data=None,
        base_url=settings.ARCH_API_BASE_URL,
        expect_response_body=JSON,
        proxy=False,
        proxy_override_headers=None,
        follow_redirects=True,
        timeout=120,
        **params,
    ):
        """Issue an ARCH API request."""

        def error(status_code, msg):
            raise ArchRequestError(
                base_url, method, user.username, path, params, data, status_code, msg
            )

        # Convert bool param value to "true"/"false"
        params = {k: cls.encode_param_value(v) for k, v in params.items()}
        try:
            r = requests.request(
                method=method,
                url=f"{base_url}/{path.removeprefix('/')}",
                params=params,
                headers=(
                    {}
                    if user.is_anonymous
                    else {
                        "X-API-USER": user.arch_username,
                        "X-API-KEY": settings.ARCH_SYSTEM_API_KEY,
                    }
                ),
                json=data,
                timeout=timeout,
                stream=proxy,
                allow_redirects=follow_redirects,
            )
        except requests.ConnectionError:
            error(HTTPStatus.SERVICE_UNAVAILABLE, "connection error")
        except requests.Timeout:
            error(HTTPStatus.REQUEST_TIMEOUT, "connection timeout")
        if not r.ok:
            error(r.status_code, r.text)
        if proxy:
            # Return a Django StreamingHttpResponse object.
            headers = r.headers.copy()
            if proxy_override_headers:
                headers.update(proxy_override_headers)
            return StreamingHttpResponse(
                r.raw, headers=headers, status=r.status_code, reason=r.reason
            )
        if expect_response_body is False:
            return None
        if expect_response_body == JSON:
            try:
                return r.json()
            except JSONDecodeError:
                error(r.status_code, "JSON decode error")
        return r.text

    @classmethod
    def get(cls, user, path, proxy=False, follow_redirects=True, **params):
        """Issue an ARCH API GET request."""
        return cls.request(
            "GET",
            user,
            path,
            expect_response_body=True,
            proxy=proxy,
            follow_redirects=follow_redirects,
            **params,
        )

    @classmethod
    def get_json(cls, user, path, **params):
        """Issue an ARCH API GET request."""
        return cls.request("GET", user, path, **params)

    @classmethod
    def post(cls, user, path, data, expect_response_body=JSON, **params):
        """Issue an ARCH API POST request."""
        return cls.request(
            "POST",
            user,
            path,
            data=data,
            expect_response_body=expect_response_body,
            # Filter out any None-value params.
            **{k: v for k, v in params.items() if v is not None},
        )

    @classmethod
    def run_job(cls, user, input_spec, job_id, sample, job_params):
        """Run a job."""
        return cls.post(
            user,
            f"/runjob/{job_id}",
            data={
                "user": user.arch_username,
                "inputSpec": input_spec,
                "params": job_params,
            },
            sample=sample,
        )

    @classmethod
    def get_dataset_sample_viz_data(cls, user, job_run_uuid):
        """Get the dataset sample visualization data."""
        try:
            return cls.get_json(user, f"/job/{job_run_uuid}/sample_viz_data")
        except ArchRequestError as e:
            if e.status_code != HTTPStatus.NOT_FOUND:
                raise
            raise Http404 from e

    @classmethod
    def publish_dataset(cls, user, input_spec, metadata):
        """Publish a Dataset"""
        return cls.run_job(
            user=user,
            input_spec=input_spec,
            job_id="DatasetPublication",
            sample=None,
            job_params={"metadata": metadata},
        )

    @classmethod
    def get_dataset_publication_info(cls, user, job_run_uuid):
        """Return publication info, less pbox metadata, for the specified
        dataset.
        """
        try:
            return cls.get_json(user, f"/job/{job_run_uuid}/published")
        except ArchRequestError as e:
            if e.status_code != HTTPStatus.NOT_FOUND:
                raise
            raise Http404 from e

    @classmethod
    def get_published_item_metadata(cls, user, job_run_uuid):
        """Return the petabox metadata object for the specified item."""
        try:
            return cls.get_json(user, f"/job/{job_run_uuid}/petabox/metadata")
        except ArchRequestError as e:
            if e.status_code != HTTPStatus.NOT_FOUND:
                raise
            raise Http404 from e

    @classmethod
    def update_published_item_metadata(cls, user, job_run_uuid, metadata):
        """Update the petabox metadata object for the specified item."""
        # NOTE: in local dev, Petabox returns the following error on metadata
        # update attempts - perhaps because dev is creating items in the special
        # "test_collection" collection?
        try:
            return cls.post(
                user,
                f"/job/{job_run_uuid}/petabox/metadata",
                data=metadata,
                expect_response_body=False,
            )
        except ArchRequestError as e:
            if e.status_code != HTTPStatus.NOT_FOUND:
                raise
            raise Http404 from e

    @classmethod
    def delete_published_item(cls, user, job_run_uuid):
        """Delete/dark a published petabox item."""
        try:
            return cls.post(
                user,
                f"/job/{job_run_uuid}/petabox/delete",
                data={"delete": True},
                expect_response_body=False,
            )
        except ArchRequestError as e:
            if e.status_code != HTTPStatus.NOT_FOUND:
                raise
            raise Http404 from e

    @classmethod
    def proxy_file_preview_download(
        cls, user, job_run_uuid, filename, download_filename
    ):
        """Download a dataset file preview."""
        return cls.get(
            user,
            f"/job/{job_run_uuid}/preview/{filename}",
            proxy=True,
            proxy_override_headers={
                "content-disposition": content_disposition_header(
                    True, download_filename
                ),
            },
        )

    @classmethod
    def proxy_file_download(
        cls, user, job_run_uuid, filename, download_filename, access_token
    ):
        """Download a dataset file."""
        return cls.get(
            user,
            f"/job/{job_run_uuid}/download/{filename}",
            proxy=True,
            proxy_override_headers={
                "content-disposition": content_disposition_header(
                    True, download_filename
                ),
            },
            access=access_token,
        )

    @classmethod
    def proxy_colab_redirect(
        cls,
        user,
        job_run_uuid,
        filename,
        access_token,
        file_download_url,
    ):
        """Redirect to a Google Colab initialized with the dataset file"""
        return cls.get(
            user,
            f"/job/{job_run_uuid}/colab/{filename}",
            proxy=True,
            follow_redirects=False,
            access=access_token,
            file_download_url=file_download_url,
        )

    @classmethod
    def list_wasapi_files(cls, user, job_run_uuid, page):
        """Return a WASAPI dataset file listing response."""
        return cls.get_json(
            user,
            f"/job/{job_run_uuid}/result",
            page=page,
        )

    @classmethod
    def generate_dataset(cls, user, input_spec, job_id, params):
        """(Re)Generate a Dataset."""
        # ARCH expects 'sample' to be specified as a query parameter,
        # so pop it from the params dict.
        sample = params.pop("sample")
        return cls.run_job(
            user=user,
            input_spec=input_spec,
            job_id=job_id,
            sample=sample,
            job_params=params,
        )

    @classmethod
    def create_sub_collection(cls, user, input_spec, job_params):
        """Create a custom sub-collection."""
        return cls.run_job(
            user=user,
            input_spec=input_spec,
            job_id=settings.KnownArchJobUuids.USER_DEFINED_QUERY,
            sample=None,
            job_params=job_params,
        )

    @classmethod
    def proxy_admin_logs_request(cls, user, log_type):
        """Return an admin job logs response."""
        return cls.get(
            user,
            f"/logs/{log_type}",
            base_url=settings.ARCH_ADMIN_BASE_URL,
            proxy=True,
        )
