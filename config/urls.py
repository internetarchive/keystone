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
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path

from keystone import forms as keystone_forms
from keystone import views
from keystone.api import private_api, public_api

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("/collections", views.collections, name="collections"),
    path("/datasets", views.datasets, name="datasets"),
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
        "admin/keystone/user/import_ait_users",
        views.import_ait_users,
        name="import_ait_users",
    ),
    path(
        "admin/keystone/user/get_ait_user_info",
        views.get_ait_user_info,
        name="get_ait_user_info",
    ),
    path(
        "admin/keystone/user/get_ait_account_users_info",
        views.get_ait_account_users_info,
        name="get_ait_account_users_info",
    ),
    path("admin/", admin.site.urls),
    path("api/", public_api.urls),
    path("private/api/", private_api.urls),
]
