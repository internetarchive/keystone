import functools

from django.contrib import messages
from django.http import HttpResponseForbidden
from django.shortcuts import render

from .forms import CSVUploadForm
from .helpers import parse_csv
from .models import User


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
