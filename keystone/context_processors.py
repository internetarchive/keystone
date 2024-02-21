import datetime

from django.conf import settings as _settings
from django.shortcuts import reverse

from keystone.models import CollectionTypes


def extra_builtins(request):
    """Make additional Python built-ins available in templates."""
    return {
        "datetime": datetime,
        "isinstance": isinstance,
        "str": str,
        "tuple": tuple,
    }


def settings(request):
    """A subset of (non-secret) settings values."""
    return {
        "settings": {
            "KEYSTONE_GIT_COMMIT_HASH": _settings.KEYSTONE_GIT_COMMIT_HASH,
        }
    }


def helpers(request):
    """Extra template helpers."""
    return {
        "abs_url": (
            lambda path, args: _settings.PUBLIC_BASE_URL + reverse(path, args=args)
        ),
        "CollectionTypes": CollectionTypes,
    }
