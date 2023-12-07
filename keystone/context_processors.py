from django.conf import settings


def keystone_version(request):
    """Get keystone version"""
    return {
        "KEYSTONE_GIT_COMMIT_HASH": settings.KEYSTONE_GIT_COMMIT_HASH,
    }
