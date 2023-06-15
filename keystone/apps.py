from django.apps import AppConfig


class KeystoneConfig(AppConfig):
    """Django App Config for Keystone.
    See: https://docs.djangoproject.com/en/4.2/ref/applications/#application-configuration
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "keystone"
