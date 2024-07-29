"""
URL configuration for keystone project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from importlib import import_module

from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include

from config.settings import (
    is_plugin_module_name,
    get_plugin_module_app_name,
)
from keystone import forms as keystone_forms
from keystone import views
from keystone.api import private_api, public_api, wasapi_api


def get_installed_plugin_urlpatterns():
    """Return the urlpatterns list for all installed plugins.
    Plugins must be specified in settings.INSTALLED_APPS with a name in the
    format: "keystone_{plugin_name}_plugin"
    If a keystone_*_plugin.urls module exists that defines a urlpatterns
    list, we'll include those urls here, at a base path specified by either
    any defined keystone_*_plugin.urls.URL_NAMESPACE value, or at a
    default of "plugins/{app_name}".
    """
    plugin_urlpatterns = []
    for app_name in settings.INSTALLED_APPS:
        if not is_plugin_module_name(app_name):
            continue
        try:
            urls_mod = import_module(f"{app_name}.urls")
        except ModuleNotFoundError:
            continue
        if not hasattr(urls_mod, "urlpatterns"):
            continue
        base_path = (
            getattr(
                urls_mod,
                "URL_NAMESPACE",
                f"plugins/{get_plugin_module_app_name(app_name)}",
            ).strip("/")
            + "/"
        )
        plugin_urlpatterns.append(path(base_path, include(urls_mod.urlpatterns)))
    return plugin_urlpatterns


urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("account", views.account, name="account"),
    path("account/users", views.account_users, name="account-users"),
    path("account/teams", views.account_teams, name="account-teams"),
    path("collections", views.collections, name="collections"),
    path(
        "collections/custom-collection-builder",
        views.sub_collection_builder,
        name="sub-collection-builder",
    ),
    path(
        "collections/<int:collection_id>",
        views.collection_detail,
        name="collection-detail",
    ),
    path("datasets", views.datasets),
    path("datasets/explore", views.datasets_explore, name="datasets-explore"),
    path("datasets/generate", views.datasets_generate, name="datasets-generate"),
    path("datasets/<int:dataset_id>", views.dataset_detail, name="dataset-detail"),
    path(
        "datasets/<int:dataset_id>/files/<filename>/preview",
        views.dataset_file_preview,
        name="dataset-file-preview",
    ),
    path(
        "datasets/<int:dataset_id>/files/<filename>",
        views.dataset_file_download,
        name="dataset-file-download",
    ),
    path(
        "datasets/<int:dataset_id>/files/<filename>/colab",
        views.dataset_file_colab,
        name="dataset-file-colab",
    ),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path(
        "accounts/password_change/",
        auth_views.PasswordChangeView.as_view(),
        name="password_change",
    ),
    path(
        "accounts/password_change/done/",
        auth_views.PasswordChangeDoneView.as_view(),
        name="password_change_done",
    ),
    path(
        "accounts/password_reset/",
        auth_views.PasswordResetView.as_view(
            extra_context={"arch_support_ticket_url": settings.ARCH_SUPPORT_TICKET_URL},
            extra_email_context={
                "arch_support_ticket_url": settings.ARCH_SUPPORT_TICKET_URL
            },
            form_class=keystone_forms.KeystonePasswordResetForm,
            template_name="registration/password_reset_form.html",
        ),
        name="password_reset",
    ),
    path(
        "accounts/password_reset/done",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "accounts/reset/<uidb64>/<token>",
        auth_views.PasswordResetConfirmView.as_view(
            form_class=keystone_forms.KeystoneSetPasswordForm
        ),
        name="password_reset_confirm",
    ),
    path(
        "accounts/reset/done",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path(
        "accounts/logout_then_login",
        auth_views.logout_then_login,
        name="logout_then_login",
    ),
    path(
        "admin/keystone/bulk_add_users",
        views.bulk_add_users,
        name="bulk_add_users",
    ),
    path(
        "collection_surveyor",
        views.collection_surveyor,
        name="collection_surveyor",
    ),
    path(
        "collection_surveyor/search/",
        views.collection_surveyor_search,
        name="collection_surveyor_search",
    ),
    path(
        "admin/arch_logs/<log_type>",
        views.get_arch_job_logs,
        name="get_arch_job_logs",
    ),
    path("admin/", admin.site.urls),
    path("api/", public_api.urls),
    path("private/api/", private_api.urls),
    path("wasapi/v1/", wasapi_api.urls),
] + get_installed_plugin_urlpatterns()
