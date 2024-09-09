from pytest import (
    fixture,
    mark,
    raises,
)

from django.db import OperationalError

from keystone.models import CollectionTypes


###############################################################################
# Fixtures
###############################################################################


@fixture
def make_special_collection(make_collection):
    def f(**kwargs):
        return make_collection(collection_type=CollectionTypes.SPECIAL, **kwargs)

    return f


###############################################################################
# User Table Trigger Tests
###############################################################################


@mark.django_db
def test_user_insert_trigger(make_account, make_user):
    """A user can only be inserted if the number of existing account users
    is below account.max_users."""
    account = make_account(max_users=1)
    make_user(account=account)
    # Check that attempting to create another user fails.
    with raises(OperationalError) as exc_info:
        make_user(account=account)
    assert exc_info.value.args[0].startswith("account max users limit reached")


@mark.django_db
def test_user_update_trigger_allowed(make_account, make_user):
    """Any colummn but {account_id,username} is updatable."""
    user = make_user()
    user.email = "test@archive.org"
    user.save()


@mark.django_db
def test_user_update_trigger_username_is_immutable(make_user):
    """username is immutable."""
    user = make_user()
    user.username = "new username"
    with raises(OperationalError) as exc_info:
        user.save()
    assert exc_info.value.args[0].startswith("username is immutable")


###############################################################################
# Collection Table Trigger Tests
###############################################################################


@mark.django_db
def test_create_multiple_collections_with_no_defined_metadata__input_spec__ok(
    make_special_collection,
):
    """Creating multiple Collections with no defined metadata.input_spec key will not violate
    the uniqueness constraint."""
    make_special_collection(metadata=None)
    make_special_collection(metadata=None)


@mark.django_db
def test_create_multiple_collections_with_metadata__input_spec_eq_null_ok(
    make_special_collection,
):
    """Creating multiple Collections with metadata.input_spec=None will not violate the
    uniqueness constraint."""
    make_special_collection(metadata={"input_spec": None})
    make_special_collection(metadata={"input_spec": None})


@mark.django_db
def test_create_multiple_collections_with_metadata__input_spec_ne_null_not_ok(
    FILES_INPUT_SPEC, make_special_collection
):
    """Creating multiple Collections with metadata.input_spec defined and equal to something
    other than None will violate the uniqueness constraint."""
    make_special_collection(metadata={"input_spec": FILES_INPUT_SPEC})
    with raises(OperationalError) as exc_info:
        make_special_collection(metadata={"input_spec": FILES_INPUT_SPEC})
    assert exc_info.value.args[0].startswith(
        "metadata.input_spec violates unique constraint"
    )


@mark.django_db
def test_non_unique_constraint_violating_collection__metadata__input_spec_updates(
    FILES_INPUT_SPEC,
    make_special_collection,
):
    """Updating a Collection to no longer define metadata.input_spec, or as a value unique
    to itself, will not violate the uniqueness constraint."""
    make_special_collection()
    make_special_collection(metadata={})
    make_special_collection(metadata={"input_spec": None})
    make_special_collection(metadata={"input_spec": FILES_INPUT_SPEC})
    c = make_special_collection()
    for metadata in (
        {},
        {"input_spec": None},
        {"input_spec": FILES_INPUT_SPEC | {"dataSource": "http"}},
    ):
        c.metadata = metadata
        c.save()


@mark.django_db
def test_unique_constraint_violating_collection__metadata__input_spec_update(
    FILES_INPUT_SPEC,
    make_special_collection,
):
    """Updating a Collection to an existing metadata.input_spec value will violate the
    uniqueness constraint."""
    make_special_collection(metadata={"input_spec": FILES_INPUT_SPEC})
    c = make_special_collection()
    c.metadata = {"input_spec": FILES_INPUT_SPEC}
    with raises(OperationalError) as exc_info:
        c.save()
    assert exc_info.value.args[0].startswith(
        "metadata.input_spec violates unique constraint"
    )


@mark.django_db
def test_updating_collection__metadata__input_spec_to_save_value_ok(
    FILES_INPUT_SPEC, make_special_collection
):
    """Updating a Collection metadata.input_spec value to its existing, non-null value
    will not violate the uniqueness constraint."""
    c = make_special_collection(metadata={"input_spec": FILES_INPUT_SPEC})
    c.metadata = {"input_spec": FILES_INPUT_SPEC}
    c.save(update_fields=("metadata",))
