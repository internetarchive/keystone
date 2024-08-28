from http import HTTPStatus

from django.test import Client as _Client
from pytest import mark

from config.settings import COLAB_MAX_FILE_SIZE_BYTES


###############################################################################
# Helpers
###############################################################################


class Client(_Client):
    def __init__(self, user):
        super().__init__()
        self.force_login(user)


###############################################################################
# Tests
###############################################################################


@mark.django_db
def test_dataset_file_colab_file_size_limit(
    make_user, make_user_dataset, make_jobcomplete, make_jobfile
):
    """Attempting to open a file in Colab with a size that exceeds
    settings.COLAB_MAX_FILE_SIZE_BYTES results in a 400 response.
    """
    user = make_user()
    dataset = make_user_dataset(user)
    job_complete = make_jobcomplete(job_start=dataset.job_start)
    job_file = make_jobfile(
        job_complete=job_complete, size_bytes=COLAB_MAX_FILE_SIZE_BYTES + 1
    )

    client = Client(user)
    res = client.get(f"/datasets/{dataset.id}/files/{job_file.filename}/colab")
    assert res.status_code == HTTPStatus.BAD_REQUEST
    assert (
        res.content.decode()
        == f"File size ({job_file.size_bytes}) exceeds max supported Google Colab size ({COLAB_MAX_FILE_SIZE_BYTES})"
    )
