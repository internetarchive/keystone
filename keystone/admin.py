from typing import Self
from django.contrib import admin
from django.contrib import messages
from django.template.defaultfilters import filesizeformat

from . import models
from .hashers import PBKDF2WrappedSha1PasswordHasher


class WrapPasswordMixin:
    """Provide a Django admin action to wrap the passwords of selected rows in the
    User list display."""

    def wrap_sha1_passwords_of_selected_users(
        self: admin.ModelAdmin | Self, request, queryset
    ):
        """wrap sha1 password with with PBKDF2 encoding for selected users"""
        hasher = PBKDF2WrappedSha1PasswordHasher()

        for user in queryset:
            if user.password.startswith("sha1"):
                _algorithm, sha1_hash = user.password.split(":", 1)
                user.password = hasher.encode_sha1_hash(sha1_hash)
                user.save(update_fields=["password"])
                messages.add_message(
                    request,
                    messages.INFO,
                    "Wrapped sha1 password for user: " + user.username,
                )
            else:
                messages.add_message(
                    request,
                    messages.ERROR,
                    "Password is not in sha1: format for user: " + user.username,
                )

    wrap_sha1_passwords_of_selected_users.short_description = (
        "Wrap sha1 password with with PBKDF2 encoding for selected users"
    )


class CollectionAccountInline(admin.TabularInline):
    """Add inline Collection table to AccountAdmin"""

    model = models.Collection.accounts.through


class CollectionTeamInline(admin.TabularInline):
    """Add inline Collection table to TeamAdmin"""

    model = models.Collection.teams.through


class CollectionUserInline(admin.TabularInline):
    """Add inline Collection table to UserAdmin"""

    model = models.Collection.users.through


@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    """Django admin config for Account"""

    list_display = (
        "id",
        "name",
    )
    inlines = (CollectionAccountInline,)


@admin.register(models.Team)
class TeamAdmin(admin.ModelAdmin):
    """Django admin config for Team"""

    list_display = (
        "id",
        "name",
        "account_name",
    )
    inlines = (CollectionTeamInline,)

    @admin.display(description="Account", ordering="account__name")
    def account_name(self, team):
        """Show the Team's Account's name in Django admin list_display"""
        return team.account


@admin.register(models.User)
class UserAdmin(admin.ModelAdmin, WrapPasswordMixin):
    """Django admin config for User"""

    list_display = (
        "username",
        "account_name",
    )
    inlines = (CollectionUserInline,)
    actions = ("wrap_sha1_passwords_of_selected_users",)

    @admin.display(description="Account", ordering="account__name")
    def account_name(self, user):
        """Show the User's Account's name in Django admin list_display"""
        return user.account


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    """Django admin config for Collection"""

    list_display = (
        "id",
        "name",
        "collection_type",
    )
    list_display_links = ("name",)
    search_fields = (
        "id",
        "name",
    )
    search_help_text = "Search by Collection ID or Collection Name"


@admin.register(models.ArchQuota)
class ArchQuotaAdmin(admin.ModelAdmin):
    """Django admin config for ArchQuota"""

    list_display = (
        "content_type",
        "object_id",
        "content_object",
        "quota_input_bytes",
    )


@admin.register(models.JobType)
class JobTypeAdmin(admin.ModelAdmin):
    """Django admin config for JobType"""

    list_display = (
        "id",
        "name",
    )


@admin.register(models.JobStart)
class JobStartAdmin(admin.ModelAdmin):
    """Django admin config for JobStart"""

    list_display = (
        "id",
        "job_type",
        "user",
        "input_size",
        "sample",
        "commit_hash",
        "created_at",
    )

    @admin.display(description="Input Size", ordering="-input_bytes")
    def input_size(self, job_start, human=True):
        """Get human-friendly format for the size of a Job's input.
        This is intended primarily for Django admin list_display.
        """
        if human:
            return filesizeformat(job_start.input_bytes)
        return job_start.input_bytes


@admin.register(models.JobComplete)
class JobCompleteAdmin(admin.ModelAdmin):
    """Django admin config for JobComplete"""

    list_display = (
        "id",
        "job_start",
        "output_bytes",
        "created_at",
    )


@admin.register(models.JobEvent)
class JobEventAdmin(admin.ModelAdmin):
    """Django admin config for JobEvent"""

    list_display = (
        "id",
        "job_start",
        "event_type",
        "created_at",
    )
