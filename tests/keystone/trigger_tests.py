from pytest import (
    mark,
    raises,
)

from django.db import OperationalError


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
