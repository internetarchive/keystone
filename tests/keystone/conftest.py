from functools import partial
from model_bakery import baker
from pytest import fixture

from keystone.models import Account, User


def maker(model):
    return partial(baker.make, model)


@fixture
def make_account():
    return maker(Account)


@fixture
def make_user():
    return maker(User)
