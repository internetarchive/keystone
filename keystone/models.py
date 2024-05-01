"""Core Django models for Keystone."""

from collections import defaultdict, namedtuple
from functools import reduce
from operator import or_

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.db import transaction
from django.db import IntegrityError
from django.db.models import F, Q
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

import uuid6

from config import settings
from .validators import validate_username
from .helpers import is_uuid7


# Define a namedtuple to return from JobStart.get_job_status()
JobStatus = namedtuple("JobStatus", ("state", "start_time", "finished_time"))


def choice_constraint(field, choices):
    """Create a check constraint for a given Django model field name and Choices
    subclass. Check constraints are enforced in the database."""
    q_objects = (Q(**{field: choice[0]}) for choice in choices.choices)
    return models.CheckConstraint(
        check=reduce(or_, q_objects),
        name=f"check_valid_{field}",
    )


class Account(models.Model):
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


class User(AbstractUser):
    """Keystone user. Django Auth model."""

    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[validate_username],
    )

    email = models.EmailField(unique=True)
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    role = models.CharField(
        choices=UserRoles.choices, default=UserRoles.USER, max_length=16
    )
    teams = models.ManyToManyField("Team", blank=True, related_name="members")

    REQUIRED_FIELDS = (*AbstractUser.REQUIRED_FIELDS, "account_id", "role")

    class Meta:
        constraints = [choice_constraint(field="role", choices=UserRoles)]
        permissions = [("change_role", "Can change user roles")]

    @property
    def arch_username(self):
        """Return the user's corresponding ARCH username."""
        return f"ks:{self.username}"

    def save(self, *args, **kwargs):
        """Normalize the email address (i.e. lowercase the domain part) to prevent
        dupes."""
        self.email = BaseUserManager.normalize_email(self.email)
        super().save()

    def __str__(self):
        return self.username

    @staticmethod
    @transaction.atomic
    def create_users_from_data_dict_list(user_data):
        """Create Users from a list of dictionaries of user data"""

        try:
            with transaction.atomic():
                for row in user_data:
                    User.objects.create(
                        password=row["password"],
                        first_name=row["first_name"],
                        last_name=row["last_name"],
                        username=row["username"],
                        email=row["email"],
                        is_staff=False,
                        is_active=True,
                        role="USER",
                        is_superuser=False,
                        account_id=row["account_id"],
                    )
            return None
        except IntegrityError as e:
            return str(e)


@receiver(pre_save, sender=User)
def enforce_username_immutability(sender, instance, **kwargs):
    """Raise an IntegrityError on attempted username update."""
    try:
        db_user = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        pass
    else:
        if not db_user.username == instance.username:
            raise IntegrityError("Can not update immutable field User.username")


class Team(models.Model):
    """Users may be members of zero or more teams.
    Teams belong to a single Account.
    """

    name = models.CharField(max_length=255)
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [
            ("manage_membership", "Can add or remove members from teams"),
        ]

    def __str__(self):
        return self.name


class CollectionTypes(models.TextChoices):
    """ARCH can use different types of collections as inputs for Jobs."""

    AIT = "AIT", "Archive-It"
    SPECIAL = "SPECIAL", "Special"
    CUSTOM = "CUSTOM", "Custom"


class Collection(models.Model):
    """Collections are the main inputs for ARCH jobs."""

    arch_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    collection_type = models.CharField(choices=CollectionTypes.choices, max_length=16)
    accounts = models.ManyToManyField(Account, blank=True, related_name="collections")
    teams = models.ManyToManyField(Team, blank=True, related_name="collections")
    users = models.ManyToManyField(User, blank=True, related_name="collections")
    created_at = models.DateTimeField(auto_now_add=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    metadata = models.JSONField(encoder=DjangoJSONEncoder, null=True, blank=True)

    class Meta:
        constraints = [
            choice_constraint(field="collection_type", choices=CollectionTypes),
        ]

    @classmethod
    def user_queryset(cls, user):
        """Return a queryset comprising all Collections the user has access to."""
        return Collection.objects.filter(
            Q(users=user) | Q(accounts__user=user) | Q(teams__members=user)
        ).distinct()

    @classmethod
    def handle_job_event(cls, job_event):
        """Update a Custom Collection's metadata.state"""
        state = job_event.job_start.get_job_status().state
        collection = job_event.job_start.collection
        if collection.collection_type != CollectionTypes.CUSTOM:
            return
        collection.metadata["state"] = state
        collection.save()

    @classmethod
    def handle_job_complete(cls, job_complete):
        """Update a Custom Collection's size"""
        collection = job_complete.job_start.collection
        if collection.collection_type != CollectionTypes.CUSTOM:
            return
        collection.size_bytes = job_complete.output_bytes
        collection.save()

    @property
    def input_spec(self):
        """Return the ARCH InputSpec object for this collection."""
        if self.collection_type not in (
            CollectionTypes.AIT,
            CollectionTypes.SPECIAL,
            CollectionTypes.CUSTOM,
        ):
            raise NotImplementedError
        # Return dataset-type input spec if arch_id like "CUSTOM-{uuid}".
        if (
            self.collection_type == CollectionTypes.CUSTOM
            and len(splits := self.arch_id.split("-", 1)) == 2
            and is_uuid7(splits[1])
        ):
            return {"type": "dataset", "inputType": "cdx", "uuid": splits[1]}
        # Return a collection-type input spec.
        return {"type": "collection", "collectionId": self.arch_id}

    @classmethod
    def get_for_input_spec(cls, input_spec):
        """Return the collection that matches the specified InputSpec object."""
        if input_spec["type"] == "collection":
            return cls.objects.get(arch_id=input_spec["collectionId"])

        if input_spec["type"] == "dataset" and input_spec.get("inputType") == "cdx":
            return cls.objects.get(arch_id=f"CUSTOM-{input_spec['uuid']}")

        raise NotImplementedError

    def __str__(self):
        return self.name


class ArchQuota(models.Model):
    """ArchQuotas can be assigned to Accounts, Teams, and Users.
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
        """Return all ArchQuotas that apply to this user."""
        content_types = ContentType.objects.get_for_models(Account, Team, User)
        quotas = ArchQuota.objects.filter(
            Q(content_type=content_types[Account], object_id=user.account_id)
            | Q(content_type=content_types[Team], object_id__in=user.teams.all())
            | Q(content_type=content_types[User], object_id=user.id)
        )
        quota_dict = defaultdict(list)
        for quota in quotas:
            if quota.content_type == content_types[Account]:
                quota_dict[Account] = quota
            if quota.content_type == content_types[Team]:
                quota_dict[Team].append(quota)
            if quota.content_type == content_types[User]:
                quota_dict[User] = quota
        return quota_dict


class JobCategory(models.Model):
    """JobCategory represents JobType categories."""

    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)


class JobType(models.Model):
    """JobTypes are the things we do in ARCH. We say JobType to disambiguate from
    any particular Job execution."""

    id = models.UUIDField(primary_key=True, default=uuid6.uuid7)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(JobCategory, on_delete=models.PROTECT)
    description = models.TextField()
    can_run = models.BooleanField()
    can_publish = models.BooleanField()
    input_quota_eligible = models.BooleanField()
    output_quota_eligible = models.BooleanField()
    download_quota_eligible = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    parameters_schema = models.JSONField(null=True)

    def __str__(self):
        return f"{self.id} - {self.name}"


class JobEventTypes(models.TextChoices):
    """ARCH can use different types of collections as inputs for Jobs."""

    # Choices are ordered from less to more advanced state.
    SUBMITTED = "SUBMITTED", "Submitted"
    QUEUED = "QUEUED", "Queued"
    RUNNING = "RUNNING", "Running"
    FINISHED = "FINISHED", "Finished"
    FAILED = "FAILED", "Failed"
    CANCELLED = "CANCELLED", "Cancelled"

    @classmethod
    def is_terminal(cls, name) -> bool:
        """Return a bool indicating whether an event type is terminal."""
        return cls.names.index(name) > cls.names.index(cls.RUNNING)


class JobStart(models.Model):
    """There should be a JobStart record each time a user runs a job."""

    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    collection = models.ForeignKey(Collection, on_delete=models.PROTECT)
    job_type = models.ForeignKey(JobType, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    quotas = models.ManyToManyField(ArchQuota)
    input_bytes = models.PositiveBigIntegerField(default=0)
    sample = models.BooleanField(default=False)
    parameters = models.JSONField(null=False, blank=False)
    commit_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField()

    def get_job_status(self):
        """Return a (state, start_time, finished_time) tuple representing the
        current state of the associated job."""
        job_events = self.jobevent_set.order_by("-created_at").all()
        latest_job_event = job_events[0]
        latest_job_event_type = latest_job_event.event_type

        # If job is queued, set start_time to the QUEUED event created_at value,
        # otherwise assume that there exists a RUNNING event and use its created_at.
        start_time_event_type = (
            JobEventTypes.QUEUED
            if latest_job_event_type == JobEventTypes.QUEUED
            else JobEventTypes.RUNNING
        )
        start_time = next(
            job_event.created_at
            for job_event in job_events
            if job_event.event_type == start_time_event_type
        )

        # Set finished_time to the created_at value of latest event if terminal,
        # or None if not terminal.
        finished_time = (
            latest_job_event.created_at
            if JobEventTypes.is_terminal(latest_job_event_type)
            else None
        )

        return JobStatus(latest_job_event_type, start_time, finished_time)


@receiver(post_save, sender=JobStart)
def job_start_post_save(sender, instance, **kwargs):  # pylint: disable=unused-argument
    """Maybe create a Dataset instance."""
    if kwargs["created"] and instance.job_type.can_run:
        Dataset.handle_job_start(instance)


class JobComplete(models.Model):
    """JobComplete tracks completed JobStarts against Quotas."""

    job_start = models.OneToOneField(JobStart, on_delete=models.PROTECT)
    output_bytes = models.PositiveBigIntegerField()
    created_at = models.DateTimeField()


@receiver(post_save, sender=JobComplete)
def job_complete_post_save(
    sender, instance, **kwargs
):  # pylint: disable=unused-argument
    """Maybe finalize a custom Collection instance in response to a JobComplete."""
    user_defined_query_type = JobType.objects.get(
        id=settings.KnownArchJobUuids.USER_DEFINED_QUERY
    )
    if instance.job_start.job_type == user_defined_query_type:
        Collection.handle_job_complete(instance)


class JobFile(models.Model):
    """A JobFile represents a single derivative file generated by a job run"""

    job_complete = models.ForeignKey(JobComplete, on_delete=models.PROTECT)
    filename = models.CharField(max_length=255)
    size_bytes = models.PositiveBigIntegerField()
    mime_type = models.CharField(max_length=255)
    line_count = models.IntegerField()
    file_type = models.CharField(max_length=32)
    creation_time = models.DateTimeField()
    md5_checksum = models.CharField(max_length=128, null=True)
    access_token = models.CharField(max_length=32)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job_complete", "filename"], name="jobfile_unique"
            )
        ]


class JobEvent(models.Model):
    """jobEvent tracks the events that occur during a job run, eg.queued, running, etc."""

    job_start = models.ForeignKey(JobStart, on_delete=models.PROTECT)
    event_type = models.CharField(choices=JobEventTypes.choices, max_length=16)
    created_at = models.DateTimeField()


@receiver(post_save, sender=JobEvent)
def job_event_post_save(sender, instance, **kwargs):  # pylint: disable=unused-argument
    """Maybe update a Dataset or custom Collection instance in response to a JobEvent."""
    user_defined_query_type = JobType.objects.get(
        id=settings.KnownArchJobUuids.USER_DEFINED_QUERY
    )
    job_type = instance.job_start.job_type
    if job_type == user_defined_query_type:
        Collection.handle_job_event(instance)
    elif job_type.can_run:
        Dataset.handle_job_event(instance)


class Dataset(models.Model):
    """A Dataset represents an in-progress or completed Job."""

    job_start = models.ForeignKey(JobStart, on_delete=models.PROTECT)
    state = models.CharField(choices=JobEventTypes.choices, max_length=16)
    start_time = models.DateTimeField(auto_now_add=True)
    finished_time = models.DateTimeField(null=True)
    teams = models.ManyToManyField("Team", blank=True, related_name="datasets")

    @classmethod
    def user_queryset(cls, user):
        """Return a queryset that constrains access to the specified user."""
        # Include datasets which are either:
        #  - owned by the specified user
        #  - owned by a user who is a teammate of the specified user and for
        #    which the team is authorized to access the dataset.
        return Dataset.objects.filter(
            Q(job_start__user=user)
            | (Q(teams=F("job_start__user__teams")) & Q(teams__members=user))
        ).distinct()

    @classmethod
    def handle_job_start(cls, job_start):
        """Create a new Dataset for each relevent JobStart."""
        cls.objects.create(job_start=job_start, state=JobEventTypes.SUBMITTED)

    @classmethod
    def handle_job_event(cls, job_event):
        """Update a Dataset in response to a JobEvent save."""
        state, start_time, finished_time = job_event.job_start.get_job_status()

        # Update the Dataset.
        dataset = cls.objects.get(job_start=job_event.job_start)
        dataset.state = state
        dataset.start_time = start_time
        dataset.finished_time = finished_time
        dataset.save()
