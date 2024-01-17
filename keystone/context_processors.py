from django.conf import settings


def helpers(request):
    """Extra template helpers."""
    return {
        "settings": settings,
    }
