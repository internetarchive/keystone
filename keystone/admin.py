from django.contrib import admin
from django.template.defaultfilters import filesizeformat

from . import models


@admin.register(models.Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """Django admin config for Organization"""

    list_display = (
        "id",
        "name",
    )


@admin.register(models.Team)
class TeamAdmin(admin.ModelAdmin):
    """Django admin config for Team"""

    list_display = (
        "id",
        "name",
        "organization_name",
    )

    @admin.display(description="Organization", ordering="organization__name")
    def organization_name(self, team):
        """Show the Team's Organization's name in Django admin list_display"""
        return team.organization


@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    """Django admin config for User"""

    list_display = (
        "username",
        "organization_name",
    )

    @admin.display(description="Organization", ordering="organization__name")
    def organization_name(self, user):
        """Show the User's Organization's name in Django admin list_display"""
        return user.organization


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
        "name",
        "version",
    )


@admin.register(models.JobStart)
class JobStartAdmin(admin.ModelAdmin):
    """Django admin config for JobStart"""

    list_display = (
        "job_type",
        "user",
        "input_size",
    )

    @admin.display(description="Input Size", ordering="-estimated_input_bytes")
    def input_size(self, job_start, human=True):
        """Get human-friendly format for the estimated size of a Job's input.
        This is intended primarily for Django admin list_display.
        """
        if human:
            return filesizeformat(job_start.estimated_input_bytes)
        return job_start.estimated_input_bytes


@admin.register(models.JobComplete)
class JobCompleteAdmin(admin.ModelAdmin):
    """Django admin config for JobComplete"""

    list_display = (
        "job_start",
        "input_bytes",
        "output_bytes",
        "created_at",
    )
