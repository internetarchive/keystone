# pylint: disable=too-many-arguments

from dataclasses import dataclass
from json import JSONDecodeError

import requests
from django.http import (
    Http404,
    StreamingHttpResponse,
)

from config import settings


JSON = "true"


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


class ArchAPI:
    """ARCH API Interface"""

    @staticmethod
    def get_arch_dataset_id(dataset):
        """Return the ARCH dataset ID string for the specified
        Keystone Dataset."""
        arch_collection_id = dataset.job_start.collection.arch_id
        sample = dataset.job_start.sample
        job_id = dataset.job_start.job_type.id
        return f"{arch_collection_id}:{'1' if sample else '0'}:{job_id}"

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
        follow_redirects=True,
        timeout=30,
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
                headers={}
                if user.is_anonymous
                else {
                    "X-API-USER": user.arch_username,
                    "X-API-KEY": settings.ARCH_SYSTEM_API_KEY,
                },
                json=data,
                timeout=timeout,
                stream=proxy,
                allow_redirects=follow_redirects,
            )
        except requests.ConnectionError:
            error(0, "connection error")
        except requests.Timeout:
            error(408, "connection timeout")
        if not r.ok:
            error(r.status_code, r.text)
        if proxy:
            # Return a Django StreamingHttpResponse object.
            return StreamingHttpResponse(
                r.raw, headers=r.headers, status=r.status_code, reason=r.reason
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
    def run_job(cls, user, collection_id, job_id, sample, job_params, rerun=False):
        """Run a job."""
        return cls.post(
            user,
            f"/runjob/{job_id}/{collection_id}",
            data=job_params,
            sample=sample,
            rerun=rerun,
        )

    @classmethod
    def get_dataset_sample_viz_data(cls, user, dataset_id):
        """Get the dataset sample visualization data."""
        try:
            return cls.get_json(user, f"/datasets/{dataset_id}/sample_viz_data")
        except ArchRequestError as e:
            if e.status_code != 404:
                raise
            raise Http404 from e

    @classmethod
    def publish_dataset(cls, user, collection_id, job_id, sample, metadata):
        """Publish a Dataset"""
        cls.run_job(
            user=user,
            collection_id=collection_id,
            job_id="DatasetPublication",
            sample=sample,
            job_params={"dataset": job_id, "metadata": metadata},
        )

    @classmethod
    def get_dataset_publication_info(cls, user, collection_id, job_id, sample):
        """Return publication info, less pbox metadata, for the specified
        dataset.
        """
        try:
            return cls.get_json(
                user, f"/petabox/{collection_id}/{job_id}", sample=sample
            )
        except ArchRequestError as e:
            if e.status_code != 404:
                raise
            raise Http404 from e

    @classmethod
    def get_published_item_metadata(cls, user, collection_id, item_id):
        """Return the petabox metadata object for the specified item."""
        try:
            return cls.get_json(user, f"/petabox/{collection_id}/metadata/{item_id}")
        except ArchRequestError as e:
            if e.status_code != 404:
                raise
            raise Http404 from e

    @classmethod
    def update_published_item_metadata(cls, user, collection_id, item_id, metadata):
        """Update the petabox metadata object for the specified item."""
        # NOTE: in local dev, Petabox returns the following error on metadata
        # update attempts - perhaps because dev is creating items in the special
        # "test_collection" collection?
        try:
            return cls.post(
                user,
                f"/petabox/{collection_id}/metadata/{item_id}",
                data=metadata,
                expect_response_body=False,
            )
        except ArchRequestError as e:
            if e.status_code != 404:
                raise
            raise Http404 from e

    @classmethod
    def delete_published_item(cls, user, collection_id, item_id):
        """Delete/dark a published petabox item."""
        try:
            return cls.post(
                user,
                f"/petabox/{collection_id}/delete/{item_id}",
                data={"delete": True},
                expect_response_body=False,
            )
        except ArchRequestError as e:
            if e.status_code != 404:
                raise
            raise Http404 from e

    @classmethod
    def proxy_file_preview_download(cls, user, collection_id, job_id, sample, filename):
        """Download a dataset file preview."""
        return cls.get(
            user,
            f"/preview/{collection_id}/{job_id}/{filename}",
            base_url=settings.ARCH_FILES_BASE_URL,
            proxy=True,
            sample=sample,
        )

    @classmethod
    def proxy_file_download(
        cls, user, collection_id, job_id, sample, filename, access_token
    ):
        """Download a dataset file."""
        return cls.get(
            user,
            f"/download/{collection_id}/{job_id}/{filename}",
            base_url=settings.ARCH_FILES_BASE_URL,
            proxy=True,
            sample=sample,
            access=access_token,
        )

    @classmethod
    def proxy_colab_redirect(
        cls,
        user,
        collection_id,
        job_id,
        sample,
        filename,
        access_token,
        file_download_url,
    ):
        """Redirect to a Google Colab initialized with the dataset file"""
        return cls.get(
            user,
            f"/colab/{collection_id}/{job_id}/{filename}?access={access_token}",
            base_url=settings.ARCH_FILES_BASE_URL,
            proxy=True,
            follow_redirects=False,
            sample=sample,
            file_download_url=file_download_url,
        )

    @classmethod
    def proxy_wasapi_request(cls, user, collection_id, job_id, sample):
        """Return a WASAPI dataset file listing response."""
        return cls.get(
            user,
            f"/jobs/{job_id}/result",
            base_url=settings.ARCH_WASAPI_BASE_URL,
            proxy=True,
            collection=collection_id,
            sample=sample,
        )

    @classmethod
    def generate_dataset(cls, user, collection_id, job_id, sample, rerun=False):
        """(Re)Generate a Dataset."""
        return cls.run_job(
            user=user,
            collection_id=collection_id,
            job_id=job_id,
            sample=sample,
            job_params={"dataset": job_id},
            rerun=rerun,
        )

    @classmethod
    def create_sub_collection(cls, user, collection_id, job_params):
        """Create a custom sub-collection."""
        return cls.run_job(
            user=user,
            collection_id=collection_id,
            job_id="UserDefinedQuery",
            sample=None,
            job_params=job_params,
            rerun=None,
        )
