from keystone.arch_api import ArchRequestError


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
