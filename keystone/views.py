import functools
import json
from io import StringIO

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core import management
from django.http import (
    HttpResponseBadRequest,
    HttpResponseForbidden,
    HttpResponseNotFound,
    JsonResponse,
)
from django.shortcuts import (
    get_object_or_404,
    redirect,
    render,
)

from .arch_api import ArchAPI
from .context_processors import helpers as ctx_helpers
from .forms import CSVUploadForm
from .helpers import parse_csv, parse_solr_facet_data
from .models import (
    Collection,
    Dataset,
    JobFile,
    User,
)
from .solr import SolrClient
from . import ait_user


###############################################################################
# Helpers
###############################################################################


def request_user_is_staff_or_superuser(request):
    """Return true if user is staff or a superuser"""

    return request.user.is_staff or request.user.is_superuser


###############################################################################
# Decorators
###############################################################################


def require_staff_or_superuser(view_func):
    """View function decorator to return a 403 if the requesting user is not
    staff or a superuser.
    """

    @functools.wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request_user_is_staff_or_superuser(request):
            return HttpResponseForbidden()
        return view_func(request, *args, **kwargs)

    return wrapper


###############################################################################
# Views
###############################################################################


@require_staff_or_superuser
def bulk_add_users(request):
    """Create User records from csv data"""

    if request.method == "POST":
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            user_data_dict_list = parse_csv(request.FILES["csv_file"])
            error_message = User.create_users_from_data_dict_list(user_data_dict_list)
            if error_message:
                messages.error(request, error_message)
                return render(
                    request, "keystone/bulk_add_users.html", {"form": CSVUploadForm()}
                )

            messages.success(request, "CSV file uploaded and processed successfully.")

    return render(request, "keystone/bulk_add_users.html", {"form": CSVUploadForm()})


@require_staff_or_superuser
def collection_surveyor(request):
    """Explore AIT Collections"""
    # Example usage
    solr_url = "http://wbgrp-svc515.us.archive.org:8983/solr"
    core_name = "ait"  # Replace with your Solr core or collection name

    # Initialize the Solr client
    solr_client = SolrClient(solr_url, core_name)

    # Perform a search query with facets
    result = solr_client.search(
        query="*:*",
        rows=1000,
        fq=["type:Collection", "publiclyVisible:true"],
        facet_fields=["f_organizationName", "f_organizationType", "f_collectionName"],
    )

    # parse data for each facet field into list of dictionaries
    parsed_facets = parse_solr_facet_data(result["facet_counts"]["facet_fields"])

    return render(
        request,
        "keystone/collection_surveyor.html",
        {
            "collections": result["response"]["docs"],
            "facets": parsed_facets,
        },
    )


@login_required
def dashboard(request):
    """Dashboard"""
    return render(request, "keystone/dashboard.html")


@login_required
def collections(request):
    """Collections table"""
    return render(request, "keystone/collections.html")


@login_required
def sub_collection_builder(request):
    """Sub-Collection Builder"""
    return render(request, "keystone/sub-collection-builder.html")


@login_required
def collection_detail(request, collection_id):
    """Collection detail view"""
    collection = get_object_or_404(Collection, id=collection_id, users=request.user)
    return render(
        request, "keystone/collection-detail.html", context={"collection": collection}
    )


@login_required
def datasets(request):
    """Redirect to datasets-explore view."""
    return redirect("datasets-explore")


@login_required
def datasets_explore(request):
    """Datasets explorer table"""
    return render(request, "keystone/datasets-explore.html")


@login_required
def datasets_generate(request):
    """Dataset generation form"""
    return render(request, "keystone/datasets-generate.html")


@login_required
def dataset_detail(request, dataset_id):
    """Dataset detail page"""
    dataset = get_object_or_404(Dataset, id=dataset_id)

    template_filename = settings.JOB_TYPE_UUID_NON_AUT_TEMPLATE_FILENAME_MAP.get(
        str(dataset.job_start.job_type.id), "aut-dataset.html"
    )

    return render(
        request, f"keystone/{template_filename}", context={"dataset": dataset}
    )


@login_required
def dataset_file_preview(request, dataset_id, filename):
    """Download a Dataset file preview."""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    return ArchAPI.proxy_file_preview_download(
        request.user,
        dataset.job_start.collection.arch_id,
        dataset.job_start.job_type.id,
        dataset.job_start.sample,
        filename,
    )


def dataset_file_download(request, dataset_id, filename):
    """Download a Dataset file."""
    # Lookup the datset without filtering by user - we'll let ARCH figure out
    # the download permissions.
    dataset = get_object_or_404(Dataset, id=dataset_id)
    job_file = get_object_or_404(
        JobFile, job_complete__job_start=dataset.job_start, filename=filename
    )

    access_token = request.GET.get("access")
    # Lookup the access_token if not specified by the dataset owner.
    if (
        access_token is None
        and request.user.is_authenticated
        and dataset.job_start.user == request.user
    ):
        access_token = job_file.access_token

    if access_token != job_file.access_token:
        return HttpResponseForbidden()

    return ArchAPI.proxy_file_download(
        request.user,
        dataset.job_start.collection.arch_id,
        dataset.job_start.job_type.id,
        dataset.job_start.sample,
        filename,
        access_token,
    )


@login_required
def dataset_file_colab(request, dataset_id, filename):
    """Open a Dataset file in Google Colab."""
    dataset = get_object_or_404(Dataset, id=dataset_id, job_start__user=request.user)
    job_file = get_object_or_404(
        JobFile, job_complete__job_start=dataset.job_start, filename=filename
    )
    return ArchAPI.proxy_colab_redirect(
        request.user,
        dataset.job_start.collection.arch_id,
        dataset.job_start.job_type.id,
        dataset.job_start.sample,
        filename,
        job_file.access_token,
        ctx_helpers(request)["abs_url"](
            "dataset-file-download", args=[dataset.id, filename]
        )
        + f"?access={job_file.access_token}",
    )


###############################################################################
# AIT User import
###############################################################################


@require_staff_or_superuser
def import_ait_users(request):
    """Import AIT users by invoking the import_ait_users management command
    and return the command's STDOUT as the JSON response {"output": <stdout>}
    """
    if request.method == "GET":
        return render(request, "keystone/import_ait_users.html")

    if request.method == "POST":
        user_ids = json.loads(request.body)["userIds"]
        sio = StringIO()
        management.call_command("import_ait_users", user_ids, stdout=sio)
        return JsonResponse({"output": sio.getvalue()})

    return HttpResponseNotFound()


@require_staff_or_superuser
def get_ait_user_info(request):
    """Return a specific AIT user dict."""
    user_id = request.GET.get("user_id")
    if user_id is None:
        return HttpResponseBadRequest("user_id required")
    user_info = ait_user.get_ait_user_info(user_id)
    # Remove password_hash.
    del user_info["password_hash"]
    return JsonResponse(user_info, safe=False)


@require_staff_or_superuser
def get_ait_account_users_info(request):
    """Return a list of AIT account user dicts."""
    account_id = request.GET.get("account_id")
    if account_id is None:
        return HttpResponseBadRequest("account_id required")
    user_infos = ait_user.get_ait_account_users_info(account_id)
    # Remove password_hash.
    for user_info in user_infos:
        del user_info["password_hash"]
    return JsonResponse(user_infos, safe=False)
