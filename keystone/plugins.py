from django.apps import (
    AppConfig,
    apps,
)
from django.urls import (
    include,
    path,
)


class PluginAppConfig(AppConfig):
    """Keystone plugin AppConfig base class"""

    base_path = None
    urlpatterns = None

    def ready(self):
        urls_mod = getattr(__import__(self.name, fromlist=["urls"]), "urls")
        if not urls_mod:
            return
        # If url_mod.URL_NAMESPACE is defined, use that as the plugin base path, otherwise
        # use "plugins/{app_name}".
        self.base_path = (
            getattr(
                urls_mod,
                "URL_NAMESPACE",
                f"plugins/{self.name.removeprefix('keystone_').removesuffix('_plugin')}",
            ).strip("/")
            + "/"
        )
        self.urlpatterns = getattr(urls_mod, "urlpatterns")

    def is_collection_metadata_handler(self, collection):
        """Return a bool indicating whether this plugin app is in charge of retrieving
        and updating metadata for this particular type of collection."""
        # pylint: disable=unused-argument
        return False

    def update_collection_metadata(self, collection, timeout_ms):
        """Attempt to update the collection with the most up-to-date metadata within
        (if timeout_ms != None) the specified timeout and return a bool indicating whether an
        update was made.
        """
        # pylint: disable=unused-argument
        return False


def is_plugin_module_name(mod_name):
    """Return a bool indicated whether mod_name matches the expected Keystone
    plugin module name format of: 'keystone_{app_name}_plugin'.
    """
    return mod_name.startswith("keystone_") and mod_name.endswith("_plugin")


def get_plugin_apps():
    """Return a list of Keystone plugin app modules."""
    return [app for app in apps.get_app_configs() if isinstance(app, PluginAppConfig)]


def get_plugin_urlpatterns():
    """Return the urlpatterns list for all installed plugins"""
    return [
        path(app.base_path, include(app.urlpatterns))
        for app in get_plugin_apps()
        if app.urlpatterns
    ]
