from django.conf import settings


def keystone_version(request):
    return {
        "KEYSTONE_GIT_COMMIT_HASH": settings.KEYSTONE_GIT_COMMIT_HASH,
    }
