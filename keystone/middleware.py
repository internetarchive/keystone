from keystone.arch_api import ArchRequestError
from keystone.models import User


class ExceptionMiddleware:
    """Custom Exception handling middleware."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        """Convert ArchRequestErrors to HttpResponse objects."""
        if not isinstance(exception, ArchRequestError):
            return None
        return exception.to_http_response()


class ImpersonateMiddleware:
    """Allow a superuser to impersonate other users.
    Switch to a user at /some/url/?__impersonate=username.
    Switch back to your superuser at /some/url/?__unimpersonate=1"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_superuser and "__impersonate" in request.GET:
            request.session["impersonate_username"] = request.GET["__impersonate"]
        elif (
            "__unimpersonate" in request.GET
            and "impersonate_username" in request.session
        ):
            del request.session["impersonate_username"]
        if request.user.is_superuser and "impersonate_username" in request.session:
            request.user = User.objects.get(
                username=request.session["impersonate_username"]
            )

        return self.get_response(request)
