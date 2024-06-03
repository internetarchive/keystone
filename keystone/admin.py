import json
from typing import Self
from django.contrib import admin
import django.contrib.auth.admin
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib import messages
from django.forms import ModelForm, ModelMultipleChoiceField
from django.template.defaultfilters import filesizeformat
from django.utils.html import format_html

from . import models
from .hashers import PBKDF2WrappedSha1PasswordHasher


###############################################################################
# Custom Forms
###############################################################################


class KeystoneModelAdminForm(ModelForm):
    """ModelForm subclass that handles saving of M2M fields that are represented
    as KeystoneFilteredSelectMultiple form inputs."""

    @property
    def filtered_select_multiple_field_names(self):
        """Return the names of the fields that implement the
        KeystoneFilteredSelectMultiple widget."""
        return {
            name
            for name, field in self.fields.items()
            if isinstance(field.widget, KeystoneFilteredSelectMultiple)
        }

    def __init__(self, *args, **kwargs):
        """Set the initial KeystoneFilteredSelectMultiple input values."""
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            for field_name in self.filtered_select_multiple_field_names:
                self.fields[field_name].initial = getattr(
                    self.instance, field_name
                ).all()

    def save(self, commit=True):
        """Save the KeystoneFilteredSelectMultiple M2M field values."""
        instance = super().save(commit=False)
        if commit:
            instance.save()
        if instance.pk:
            for field_name in self.filtered_select_multiple_field_names:
                getattr(instance, field_name).set(self.cleaned_data[field_name])
            self.save_m2m()
        return instance


class KeystoneFilteredSelectMultiple(FilteredSelectMultiple):
    """Subclass of FilteredSelectMultiple that get_label method that subclasses
    can override to customize the option label text."""

    @staticmethod
    def get_label(instance):
        """Return the <option> label string for the specified instance."""
        return str(instance)

    def create_option(self, *args, **kwargs):
        option_d = super().create_option(*args, **kwargs)
        option_d["label"] = self.get_label(option_d["value"].instance)
        return option_d


class FilteredSelectMultipleCollections(KeystoneFilteredSelectMultiple):
    """Collections-specific subclass of KeystoneFilteredSelectMultiple."""

    @staticmethod
    def get_label(instance):
        """Prefix the label with additional field values to enable ad hoc filtering"""
        prefix_elems = [instance.id, instance.collection_type[0]]
        if instance.collection_type == models.CollectionTypes.AIT:
            prefix_elems.append(f"{instance.metadata['ait_id']:05}")
        return f"[{','.join(str(x) for x in prefix_elems)}] {instance.name}"


# pylint: disable-next=too-many-ancestors
class KeystoneUserAdminForm(
    KeystoneModelAdminForm, django.contrib.auth.forms.UserChangeForm
):
    """User-specific subclass of KeystoneModelAdminForm."""

    collections = ModelMultipleChoiceField(
        queryset=models.Collection.objects.all(),
        required=False,
        widget=FilteredSelectMultipleCollections(
            verbose_name="Collections", is_stacked=False
        ),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[
            "collections"
        ].help_text = """
        <p>
          Collection name options includes the prefixes
          <strong>[{ksCollectionId},{collectionTypeInitial},{aitId}]</strong> where:
          <br>&nbsp;&nbsp;- collectionTypeInitial is one of: A = AIT, C = Custom, S = Special
          <br>&nbsp;&nbsp;- aitId is zero-padded to 5 digits
        </p>
        """

    class Meta:
        model = models.User
        # pylint: disable-next=modelform-uses-exclude
        exclude = ()


###############################################################################
# Mixins
###############################################################################


class FilterSelectMultipleM2MMixin:
    """Mixin to provide FilteredSelectMultiple inputs for direct M2M relations."""

    filter_select_multiple_m2ms = ()

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        """Adapted from https://stackoverflow.com/a/33754748"""
        if db_field.name not in self.filter_select_multiple_m2ms:
            return super().formfield_for_manytomany(db_field, request, **kwargs)
        vertical = False
        kwargs["widget"] = FilteredSelectMultiple(db_field.verbose_name, vertical)
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class WrapPasswordMixin:
    """Provide a Django admin action to wrap the passwords of selected rows in the
    User list display."""

    @staticmethod
    def wrap_user_sha1_password(user):
        """Wrap the User's SHA1 password."""
        if not user.password.startswith("sha1"):
            raise ValueError(
                f"Password is not in sha1: format for user: {user.username}"
            )
        _algorithm, sha1_hash = user.password.split(":", 1)
        user.password = PBKDF2WrappedSha1PasswordHasher().encode_sha1_hash(sha1_hash)
        user.save(update_fields=["password"])

    def wrap_sha1_passwords_of_selected_users(
        self: admin.ModelAdmin | Self, request, queryset
    ):
        """wrap sha1 password with with PBKDF2 encoding for selected users"""
        for user in queryset:
            try:
                WrapPasswordMixin.wrap_user_sha1_password(user)
                messages.add_message(
                    request,
                    messages.INFO,
                    "Wrapped sha1 password for user: " + user.username,
                )
            except ValueError as e:
                messages.add_message(request, messages.ERROR, str(e))

    wrap_sha1_passwords_of_selected_users.short_description = (
        "Wrap sha1 password with with PBKDF2 encoding for selected users"
    )


###############################################################################
# Custom Model Admin Classes
###############################################################################


class KeystoneModelAdmin(FilterSelectMultipleM2MMixin, admin.ModelAdmin):
    """Subclass ModelAdmin to provide FilteredSelectMultiple inputs for M2M relations."""


class KeystoneUserAdmin(
    FilterSelectMultipleM2MMixin, WrapPasswordMixin, django.contrib.auth.admin.UserAdmin
):
    """Subclass auth.admin.UserAdmin to provide FilteredSelectMultiple inputs for M2M relations."""


###############################################################################
# Inlines
###############################################################################


class CollectionAccountInline(admin.TabularInline):
    """Add inline Collection table to AccountAdmin"""

    model = models.Collection.accounts.through


class CollectionTeamInline(admin.TabularInline):
    """Add inline Collection table to TeamAdmin"""

    model = models.Collection.teams.through


class UserTeamsInline(admin.TabularInline):
    """Add inline User table to TeamAdmin"""

    model = models.User.teams.through


class JobCategoryJobTypesInline(admin.TabularInline):
    """Add inline JobType table to JobCategory"""

    model = models.JobType

    fields = (
        "id",
        "name",
    )

    readonly_fields = (
        "id",
        "name",
    )

    show_change_link = True

    def has_add_permission(self, *args, **kwargs):
        return False

    def has_change_permission(self, *args, **kwargs):
        return False

    def has_delete_permission(self, *args, **kwargs):
        return False


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

    inlines = (CollectionTeamInline, UserTeamsInline)

    @admin.display(description="Account", ordering="account__name")
    def account_name(self, team):
        """Show the Team's Account's name in Django admin list_display"""
        return team.account


@admin.register(models.User)
class UserAdmin(KeystoneUserAdmin):
    """Django admin config for User"""

    form = KeystoneUserAdminForm

    filter_select_multiple_m2ms = (
        "collections",
        "teams",
    )

    list_display = (
        "username",
        "account",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    actions = ("wrap_sha1_passwords_of_selected_users",)

    # Define the fields to display in the user creation form.
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "password1",
                    "password2",
                    "email",
                    "account",
                    "role",
                ),
            },
        ),
    )

    # Customization of django.contrib.auth.admin.UserAdmin.fieldsets
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "password",
                    "account",  # added
                )
            },
        ),
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "role",  # added
                    "collections",  # added
                    "teams",  # added
                    "user_permissions",
                )
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )


@admin.register(models.Collection)
class CollectionAdmin(KeystoneModelAdmin):
    """Django admin config for Collection"""

    filter_select_multiple_m2ms = ("users", "teams")

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


@admin.register(models.Dataset)
class DatasetAdmin(KeystoneModelAdmin):
    """Django admin config for Dataset"""

    filter_select_multiple_m2ms = ("teams",)

    list_display = (
        "job_start",
        "state",
        "start_time",
        "finished_time",
    )


@admin.register(models.ArchQuota)
class ArchQuotaAdmin(admin.ModelAdmin):
    """Django admin config for ArchQuota"""

    list_display = (
        "content_type",
        "object_id",
        "content_object",
        "quota_input_bytes",
    )


@admin.register(models.JobCategory)
class JobCatgegoryAdmin(admin.ModelAdmin):
    """Django admin config for JobCategory"""

    list_display = (
        "id",
        "name",
    )

    inlines = (JobCategoryJobTypesInline,)


@admin.register(models.JobType)
class JobTypeAdmin(admin.ModelAdmin):
    """Django admin config for JobType"""

    list_display = (
        "id",
        "name",
        "category",
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

    fields = [
        f.name
        for f in models.JobStart._meta.fields
        if f.name not in ("id", "parameters")
    ] + ["parameters_display"]

    readonly_fields = [
        f.name
        for f in models.JobStart._meta.fields
        if f.name not in ("id", "parameters")
    ] + ["parameters_display"]

    @admin.display(description="Input Size", ordering="-input_bytes")
    def input_size(self, job_start, human=True):
        """Get human-friendly format for the size of a Job's input.
        This is intended primarily for Django admin list_display.
        """
        if human:
            return filesizeformat(job_start.input_bytes)
        return job_start.input_bytes

    @admin.display(description="Parameters")
    def parameters_display(self, job_start):
        """Pretty-format the parameters JSON object."""
        return format_html(
            '<pre style="color: #000; font-size: 0.8rem; line-height: 1.1rem;">{}</pre>',
            json.dumps(job_start.parameters, indent=2),
        )


@admin.register(models.JobComplete)
class JobCompleteAdmin(admin.ModelAdmin):
    """Django admin config for JobComplete"""

    list_display = (
        "id",
        "job_start",
        "output_bytes",
        "created_at",
    )


@admin.register(models.JobFile)
class JobFileAdmin(admin.ModelAdmin):
    """Django admin config for JobFile"""

    list_display = (
        "id",
        "job_complete",
        "filename",
        "file_type",
        "mime_type",
        "size_bytes",
        "creation_time",
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
