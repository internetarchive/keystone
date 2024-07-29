from functools import partial
from model_bakery import baker
from pytest import fixture

from keystone import models
from config.settings import KnownArchJobUuids


###############################################################################
# Helpers
###############################################################################


def maker(model):
    return partial(baker.make, model)


###############################################################################
# Session Fixtures
###############################################################################


@fixture(scope="session")
def django_db_setup(django_db_setup, django_db_blocker):
    """Ensure that a JobType instance exists for each of KnownArchJobUuids."""
    with django_db_blocker.unblock():
        # Create a placeholder JobCategory instance.
        job_category = models.JobCategory.objects.first()
        if not job_category:
            job_category = models.JobCategory.objects.create()
        for k in (k for k in dir(KnownArchJobUuids) if not k.startswith("__")):
            uuid = getattr(KnownArchJobUuids, k)
            if not models.JobType.objects.filter(id=uuid).exists():
                models.JobType.objects.create(
                    id=uuid,
                    category=job_category,
                    can_run=True,
                    can_publish=True,
                    input_quota_eligible=False,
                    output_quota_eligible=False,
                    download_quota_eligible=False,
                )


###############################################################################
# Fixtures
###############################################################################


@fixture
def make_account():
    return maker(models.Account)


@fixture
def make_collection():
    return maker(models.Collection)


@fixture
def make_dataset():
    return maker(models.Dataset)


@fixture
def make_jobstart():
    return maker(models.JobStart)


@fixture
def make_team():
    return maker(models.Team)


@fixture
def make_user():
    return maker(models.User)


@fixture
def make_user_dataset(make_collection, make_dataset, make_jobstart):
    def f(user):
        # Creating a JobStart for a JobType with can_run = True will result in
        # the automatic creation of a Dataset.
        job_start = make_jobstart(
            collection=make_collection(accounts=(user.account,)),
            job_type=models.JobType.objects.get(id=KnownArchJobUuids.DOMAIN_FREQUENCY),
            user=user,
        )
        dataset = models.Dataset.objects.get(job_start=job_start)
        dataset.state = models.JobEventTypes.FINISHED
        dataset.save()
        return dataset

    return f
