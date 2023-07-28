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
from keystone.api import private_api, public_api

urlpatterns = [
    path("accounts/login/", auth_views.LoginView.as_view(), name="login"),
    path("accounts/logout/", auth_views.LogoutView.as_view(), name="logout"),
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
            extra_context={"vault_team_email": settings.VAULT_TEAM_EMAIL},
            extra_email_context={"vault_team_email": settings.VAULT_TEAM_EMAIL},
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
    path("admin/", admin.site.urls),
    path("api/", public_api.urls),
    path("private/api/", private_api.urls),
]
