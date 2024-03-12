from logging import getLogger

from django.apps import AppConfig


log = getLogger()


class KeystoneConfig(AppConfig):
    """Django App Config for Keystone.
    See: https://docs.djangoproject.com/en/4.2/ref/applications/#application-configuration
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "keystone"

    def ready(self):
        """Log a warning if the ARCH system user hasn't been created yet."""
        from config import settings
        from keystone.models import User

        if not User.objects.filter(username=settings.ARCH_SYSTEM_USER).exists():
            log.warning(
                "Please create a Keystone user to serve as the ARCH system "
                "user with the username: %s",
                settings.ARCH_SYSTEM_USER,
            )
