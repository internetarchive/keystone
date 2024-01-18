from django.conf import settings as _settings


def settings(request):
    """A subset of (non-secret) settings values."""
    return {
        "settings": {
            "KEYSTONE_GIT_COMMIT_HASH": _settings.KEYSTONE_GIT_COMMIT_HASH,
            "ARCH_LOGIN_URL": _settings.ARCH_LOGIN_URL,
        }
    }
