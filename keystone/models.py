"""Core Django models for Keystone."""
from collections import defaultdict
from functools import reduce
from operator import or_

from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import Q, UniqueConstraint


def choice_constraint(field, choices):
    """Create a check constraint for a given Django model field name and Choices
    subclass. Check constraints are enforced in the database."""
    q_objects = (Q(**{field: choice[0]}) for choice in choices.choices)
    return models.CheckConstraint(
        check=reduce(or_, q_objects),
        name=f"check_valid_{field}",
    )


class Organization(models.Model):
    """Top-level for a group of Users."""

    name = models.CharField(max_length=255, unique=True)
    max_users = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserRoles(models.TextChoices):
    """The roles to which a user can be assigned"""

    ADMIN = "ADMIN", "Admin"
    USER = "USER", "User"


# Create your models here.
class User(AbstractUser):
    """Keystone user. Django Auth model."""

    email = models.EmailField(unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT)
    role = models.CharField(
        choices=UserRoles.choices, default=UserRoles.USER, max_length=16
    )
    teams = models.ManyToManyField("Team", blank=True, related_name="members")

    REQUIRED_FIELDS = (*AbstractUser.REQUIRED_FIELDS, "organization_id", "role")

    class Meta:
        constraints = [choice_constraint(field="role", choices=UserRoles)]
        permissions = [("change_role", "Can change user roles")]

    def __str__(self):
        return self.username


class Team(models.Model):
    """Users may be members of zero or more teams.
    Teams belong to a single Organization.
    """

    name = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [
            ("manage_membership", "Can add or remove members from teams"),
        ]

    def __str__(self):
        return self.name


class CollectionTypes(models.TextChoices):
    """ARCH can use different types of collections as inputs for Jobs."""

    AIT = "AIT", "AIT"
    SPECIAL = "SPECIAL", "Special"
    CUSTOM = "CUSTOM", "Custom"


class Collection(models.Model):
    """Collections are the main inputs for ARCH jobs."""

    name = models.CharField(max_length=255)
    collection_type = models.CharField(choices=CollectionTypes.choices, max_length=16)
    organizations = models.ManyToManyField(Organization)
    teams = models.ManyToManyField(Team)
    users = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            choice_constraint(field="collection_type", choices=CollectionTypes)
        ]

    def __str__(self):
        return self.name


class ArchQuota(models.Model):
    """ArchQuotas can be assigned to Organizations, Teams, and Users.
    `content_type`, `object_id`, and `content_object` generically link ArchQuotas
    to one of those three models.
    """

    # TODO: audit quota changes
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveBigIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    quota_input_bytes = models.PositiveBigIntegerField()
    quota_output_bytes = models.PositiveBigIntegerField()
    quota_download_bytes = models.PositiveBigIntegerField()
    quota_dom = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    @classmethod
    def fetch_for_user(cls, user):
        ct = ContentType.objects.get_for_models(Organization, Team, User)
        quotas = ArchQuota.objects.filter(
            Q(content_type=ct[Organization], object_id=user.organization_id)
            | Q(content_type=ct[Team], object_id__in=user.teams.all())
            | Q(content_type=ct[User], object_id=user.id)
        )
        quota_dict = defaultdict(list)
        for quota in quotas:
            if quota.content_type == ct[Organization]:
                quota_dict[Organization] = quota
            if quota.content_type == ct[Team]:
                quota_dict[Team].append(quota)
            if quota.content_type == ct[User]:
                quota_dict[User] = quota
        return quota_dict


class JobType(models.Model):
    """JobTypes are the things we do in ARCH. We say JobType to disambiguate from
    any particular Job execution."""

    name = models.CharField(max_length=255)
    version = models.CharField(max_length=255)
    can_run = models.BooleanField()
    can_publish = models.BooleanField()
    input_quota_eligible = models.BooleanField()
    output_quota_eligible = models.BooleanField()
    download_quota_eligible = models.BooleanField()
    display_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            UniqueConstraint(fields=["name", "version"], name="unique_name_version")
        ]

    def __str__(self):
        return f"{self.name} - {self.version}"


class JobStart(models.Model):
    """There should be a JobStart record each time a user runs a job."""

    # TODO: how do we handle multi-collection jobs?
    job_type = models.ForeignKey(JobType, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    quotas = models.ManyToManyField(ArchQuota)
    estimated_input_bytes = models.PositiveBigIntegerField()
    parameters = models.JSONField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)


class JobComplete(models.Model):
    """JobComplete tracks completed JobStarts against Quotas."""

    # TODO: add final state like success/failure/cancelled etc
    job_start = models.ForeignKey(JobStart, on_delete=models.PROTECT)
    input_bytes = models.PositiveBigIntegerField()
    output_bytes = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
