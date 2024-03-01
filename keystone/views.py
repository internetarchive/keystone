import functools
import json
from io import StringIO

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core import management
from django.shortcuts import render
from django.http import (
    HttpResponseBadRequest,
    HttpResponseForbidden,
    HttpResponseNotFound,
    JsonResponse,
)

from .forms import CSVUploadForm
from .helpers import parse_csv, parse_solr_facet_data
from .models import User
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
    """render collection surveyor"""
    return render(request, "keystone/collection_surveyor.html")


@require_staff_or_superuser
def collection_surveyor_search(request):
    """search ait collections using search term or facet"""
    filter_query = ["type:Collection", "publiclyVisible:true"]

    search_query = request.GET.get("q")
    search_query = "*:*" if search_query == "" else search_query

    solr_url = "http://wbgrp-svc515.us.archive.org:8983/solr"
    core_name = "ait"  # Replace with your Solr core or collection name

    # Initialize the Solr client
    solr_client = SolrClient(solr_url, core_name)

    # Perform a search query with facets
    result = solr_client.search(
        query=search_query,
        rows=1000,
        fq=filter_query,
        facet_fields=["f_organizationName", "f_organizationType", "f_collectionName"],
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
def dashboard(request):
    """Render dashboard"""
    return render(request, "keystone/dashboard.html")


@login_required
def collections(request):
    """Render collections"""
    return render(request, "keystone/collections.html")


@login_required
def datasets(request):
    """Render datasets"""
    return render(request, "keystone/datasets.html")


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
