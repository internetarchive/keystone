import functools
from datetime import datetime

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.forms import model_to_dict
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

from config import settings
from .arch_api import ArchAPI
from .context_processors import helpers as ctx_helpers
from .forms import CSVUploadForm
from .helpers import identity, parse_csv, parse_solr_facet_data
from .models import (
    Collection,
    CollectionTypes,
    Dataset,
    JobFile,
    User,
    UserRoles,
)
from .solr import SolrClient


###############################################################################
# Globals
###############################################################################


CUSTOM_COLLECTION_PARAM_KEY_LABEL_FORMATTER_TUPLES = (
    ("surtPrefixesOR", "SURT Prefix(es)", identity),
    (
        "timestampFrom",
        "Crawl Date (start)",
        lambda x: f"on or after {format_custom_collection_crawl_date(x)}",
    ),
    (
        "timestampTo",
        "Crawl Date (end)",
        lambda x: f"on or before {format_custom_collection_crawl_date(x)}",
    ),
    ("statusPrefixesOR", "HTTP Status(es)", identity),
    ("mimesOR", "MIME Type(s)", identity),
)


###############################################################################
# Helpers
###############################################################################


def request_user_is_staff_or_superuser(request):
    """Return true if user is staff or a superuser"""

    return request.user.is_staff or request.user.is_superuser


def format_custom_collection_crawl_date(s):
    """Parse a custom collection crawl date string."""

    return datetime.strftime(datetime.strptime(s, "%Y%m%d%H%M%S00"), "%h %d, %Y")


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
    """render collection surveyor"""
    return render(request, "keystone/collection_surveyor.html")


@require_staff_or_superuser
def collection_surveyor_search(request):
    """search ait collections using search term or facet"""
    filter_query = ["type:Collection", "publiclyVisible:true"]

    search_query = request.GET.get("q", "")
    search_query = "*:*" if search_query == "" else search_query

    row_count = request.GET.get("r")

    try:
        row_count = int(row_count)
    except ValueError:
        return HttpResponseBadRequest(f"invalid value for r: {row_count}")

    solr_url = "http://wbgrp-svc515.us.archive.org:8983/solr"
    core_name = "ait"  # Replace with your Solr core or collection name

    # Initialize the Solr client
    solr_client = SolrClient(solr_url, core_name)

    # Perform a search query with facets
    result = solr_client.search(
        query=search_query,
        rows=row_count,
        fq=filter_query,
        facet_fields=["f_organizationName", "f_organizationType"],
    )

    # parse data for each facet field into list of dictionaries
    parsed_facets = parse_solr_facet_data(result["facet_counts"]["facet_fields"])

    return JsonResponse(
        {
            "collections": result["response"]["docs"],
            "facets": parsed_facets,
        }
    )


@login_required
def account(request):
    """Redirect to account-users view."""
    return redirect("account-users")


@login_required
def account_users(request):
    """Account users admin"""
    # Deny non-admins.
    if request.user.role != UserRoles.ADMIN:
        return HttpResponseNotFound()
    return render(
        request, "keystone/account-users.html", context={"user": request.user}
    )


@login_required
def account_teams(request):
    """Account teams admin"""
    # Deny non-admins.
    if request.user.role != UserRoles.ADMIN:
        return HttpResponseNotFound()
    return render(
        request, "keystone/account-teams.html", context={"user": request.user}
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
    collection = get_object_or_404(
        Collection.user_queryset(request.user), id=collection_id
    )
    if collection.collection_type != CollectionTypes.CUSTOM:
        custom_context = None
    else:
        # Lookup the custom collection job configuration.
        custom_conf = collection.jobstart_set.get(
            job_type__id=settings.KnownArchJobUuids.USER_DEFINED_QUERY
        ).parameters["conf"]
        # Create the list of input collections.
        input_spec = custom_conf["inputSpec"]
        try:
            input_collections = (
                [Collection.get_for_input_spec(x) for x in input_spec["specs"]]
                if input_spec["type"] == "multi-specs"
                else [Collection.get_for_input_spec(input_spec)]
            )
        except Collection.DoesNotExist:
            # If for some reason an input_spec can't be resolved to a collection,
            # set input_collection=None and display a message on the frontend.
            input_collections = None
        # Create the list of param label/value pairs.
        custom_params = custom_conf["params"]
        custom_param_pairs = []
        for (
            param_key,
            param_label,
            param_formatter,
        ) in CUSTOM_COLLECTION_PARAM_KEY_LABEL_FORMATTER_TUPLES:
            if param_key not in custom_params:
                continue
            custom_param_pairs.append(
                (param_label, param_formatter(custom_params[param_key]))
            )
        custom_context = {
            "input_collections": input_collections,
            "param_label_value_pairs": custom_param_pairs,
        }
    return render(
        request,
        "keystone/collection-detail.html",
        context={
            "collection": collection,
            "custom_context": custom_context,
        },
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
    dataset = get_object_or_404(
        Dataset.user_queryset(request.user)
        .select_related("job_start")
        .select_related("job_start__job_type")
        .select_related("job_start__user")
        .select_related("job_start__jobcomplete"),
        id=dataset_id,
    )
    template_filename = settings.JOB_TYPE_UUID_NON_AUT_TEMPLATE_FILENAME_MAP.get(
        dataset.job_start.job_type.id, "aut-dataset.html"
    )
    files = dataset.job_start.jobcomplete.jobfile_set.all()
    return render(
        request,
        f"keystone/{template_filename}",
        context={
            "dataset": dataset,
            "is_owner": request.user == dataset.job_start.user,
            "user_teams": [model_to_dict(x) for x in request.user.teams.all()],
            "dataset_teams": [model_to_dict(x) for x in dataset.teams.all()],
            "files": files,
            "show_single_file_preview": len(files) == 1 and files[0].line_count > 0,
            "colab_disabled": settings.COLAB_DISABLED,
            "publishing_disabled": settings.PUBLISHING_DISABLED,
        },
    )


@login_required
def dataset_file_preview(request, dataset_id, filename):
    """Download a Dataset file preview."""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    # Request on behalf of the Dataset owner in the event of teammate access.
    return ArchAPI.proxy_file_preview_download(
        user=dataset.job_start.user,
        job_run_uuid=dataset.job_start.id,
        filename=filename,
        download_filename=dataset.get_download_filename(filename, preview=True),
    )


def dataset_file_download(request, dataset_id, filename):
    """Download a Dataset file."""
    access_token = request.GET.get("access")
    if access_token is not None:
        # Do an anonymous, access_key-based download request.
        user = AnonymousUser()
        dataset = get_object_or_404(Dataset, id=dataset_id)
    elif request.user.is_anonymous:
        # Deny anonymous requests that don't specify an access key.
        return HttpResponseForbidden()
    else:
        # Do a non-access_key-based / potentially-logged-in-user download request.
        # Lookup the Dataset using request.user.
        dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
        # Request on behalf of the Dataset owner in the event of teammate access.
        user = dataset.job_start.user

    return ArchAPI.proxy_file_download(
        user=user,
        job_run_uuid=dataset.job_start.id,
        filename=filename,
        download_filename=dataset.get_download_filename(filename),
        access_token=access_token,
    )


@login_required
def dataset_file_colab(request, dataset_id, filename):
    """Open a Dataset file in Google Colab."""
    dataset = get_object_or_404(Dataset.user_queryset(request.user), id=dataset_id)
    job_file = get_object_or_404(
        JobFile, job_complete__job_start=dataset.job_start, filename=filename
    )
    if job_file.size_bytes > settings.COLAB_MAX_FILE_SIZE_BYTES:
        return HttpResponseBadRequest(
            f"File size ({job_file.size_bytes}) exceeds max supported "
            f"Google Colab size ({settings.COLAB_MAX_FILE_SIZE_BYTES})"
        )
    # Request on behalf of the Dataset owner in the event of teammate access.
    return ArchAPI.proxy_colab_redirect(
        dataset.job_start.user,
        dataset.job_start.id,
        filename,
        job_file.access_token,
        ctx_helpers(request)["abs_url"](
            "dataset-file-download", args=[dataset.id, filename]
        )
        + f"?access={job_file.access_token}",
    )


@require_staff_or_superuser
def get_arch_job_logs(request, log_type):
    """Return an ARCH job log response."""
    valid_log_types = ("jobs", "running", "failed")
    if log_type not in valid_log_types:
        return HttpResponseBadRequest(
            f"Unsupported log_type: {log_type}. Please specify one of: {valid_log_types}"
        )
    user = User.objects.get(username=settings.ARCH_SYSTEM_USER)
    return ArchAPI.proxy_admin_logs_request(user, log_type)
