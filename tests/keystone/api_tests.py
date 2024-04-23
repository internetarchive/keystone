import json
from http import HTTPStatus
from unittest.mock import patch

from django.test import Client as _Client
from model_bakery import baker
from pytest import (
    fixture,
    mark,
    raises,
)

from keystone.api import CreateUserSchema
from keystone.models import (
    User,
    UserRoles,
)


###############################################################################
# Fixtures
###############################################################################


@fixture
def make_create_user_dict():
    def f(account):
        prepared_user = baker.prepare(User, account=account)
        return {
            k: getattr(prepared_user, k)
            for k in CreateUserSchema.schema()["properties"].keys()
        }

    return f


###############################################################################
# Helpers
###############################################################################


class Client(_Client):
    def __init__(self, user):
        super().__init__()
        self.force_login(user)

    def get_user(self, user_id: int):
        return self.get(f"/api/users/{user_id}")

    def create_user(self, user_d, send_welcome_email=True):
        return self.put(
            f"/api/users?send_welcome={json.dumps(send_welcome_email)}",
            user_d,
            "application/json",
        )

    def update_user(self, user, update_d):
        return self.patch(f"/api/users/{user.id}", update_d, "application/json")


###############################################################################
# /api/users tests
###############################################################################


@mark.django_db
def test_list_users(make_account, make_user):
    """Users with role=ADMIN can list their account users."""
    # Make a couple of same-account users.
    account = make_account()
    admin_user = make_user(account=account, role=UserRoles.ADMIN)
    normal_user = make_user(account=account)

    # Make a user in a different account, which we'll expect to be absent
    # from the admin_user API responses.
    other_account = make_account()
    other_user = make_user(account=other_account)

    # Check that the ADMIN-type user can list their account users.
    client = Client(admin_user)
    res = client.get("/api/users")
    assert res.status_code == HTTPStatus.OK
    data = res.json()
    assert {user["id"] for user in data["items"]} == {admin_user.id, normal_user.id}

    # Check that the account is inferred from the requesting user and that
    # specifying a different account has not effect.
    res = client.get(f"/api/users?account_id={other_account.id}")
    assert res.status_code == HTTPStatus.OK
    data = res.json()
    assert {user["id"] for user in data["items"]} == {admin_user.id, normal_user.id}

    # Check that the non-ADMIN user is denied access.
    client.force_login(normal_user)
    res = client.get(f"/api/users")
    assert res.status_code == HTTPStatus.FORBIDDEN
    assert res.json() == {"detail": "FORBIDDEN"}


@mark.django_db
def test_admin_can_get_any_same_account_user(make_account, make_user):
    """An admin user can get any same-account user."""
    account = make_account()
    admin_user = make_user(account=account, role=UserRoles.ADMIN)
    other_admin = make_user(account=account, role=UserRoles.ADMIN)
    other_user = make_user(account=account, role=UserRoles.USER)
    client = Client(admin_user)
    for user in admin_user, other_admin, other_user:
        res = client.get_user(user.id)
        assert res.status_code == HTTPStatus.OK
        assert res.json()["id"] == user.id


@mark.django_db
def test_admin_cant_get_different_account_user(make_account, make_user):
    """An admin user can get a different-account user."""
    admin_user = make_user(account=make_account(), role=UserRoles.ADMIN)
    other_account = make_account()
    other_account_admin = make_user(account=other_account, role=UserRoles.ADMIN)
    other_account_user = make_user(account=other_account, role=UserRoles.USER)
    client = Client(admin_user)
    for user in other_account_admin, other_account_user:
        res = client.get_user(user.id)
        assert res.status_code == HTTPStatus.NOT_FOUND


@mark.django_db
def test_normal_user_can_only_get_self(make_account, make_user):
    """A non-Admin user can only get their own user."""
    account = make_account()
    user = make_user(account=account, role=UserRoles.USER)
    other_admin = make_user(account=account, role=UserRoles.ADMIN)
    other_user = make_user(account=account, role=UserRoles.USER)
    other_account = make_account()
    other_account_admin = make_user(account=other_account, role=UserRoles.ADMIN)
    other_account_user = make_user(account=other_account, role=UserRoles.USER)
    client = Client(user)

    # Test that user can get self.
    res = client.get_user(user.id)
    assert res.status_code == HTTPStatus.OK
    assert res.json()["id"] == user.id

    # Test that user can't get anyone else.
    for user in other_admin, other_user, other_account_admin, other_account_user:
        res = client.get_user(user.id)
        assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
@mark.parametrize("send_welcome_email", [True, False])
@patch("keystone.api.send_email")
def test_admin_can_create_same_account_user(
    jobmail_send, send_welcome_email, make_account, make_user, make_create_user_dict
):
    """Users with role=ADMIN can create same-account users."""
    account = make_account()
    admin_user = make_user(account=account, role=UserRoles.ADMIN)

    # Create a new user and send a welcome email.
    client = Client(admin_user)
    new_user_d = make_create_user_dict(account)
    res = client.create_user(new_user_d, send_welcome_email)

    # Check that the user was created.
    assert res.status_code == HTTPStatus.CREATED
    new_user = User.objects.get(username=new_user_d["username"])
    for k, v in new_user_d.items():
        assert getattr(new_user, k) == v

    # Check that a welcome email was sent.
    if not send_welcome_email:
        jobmail_send.assert_not_called()
    else:
        jobmail_send.assert_called_once()
        jobmail_send_call_args = jobmail_send.call_args
        assert jobmail_send_call_args.args[0] == "new_user_welcome_email"
        assert jobmail_send_call_args.kwargs["context"]["user"] == new_user
        assert jobmail_send_call_args.kwargs["subject"] == "Welcome to ARCH"
        assert jobmail_send_call_args.kwargs["to"] == new_user.email


@mark.django_db
def test_admin_cant_create_other_account_user(
    make_account, make_user, make_create_user_dict
):
    """Users with role=ADMIN can not create a user in a different account."""
    account = make_account()
    admin_user = make_user(account=account, role=UserRoles.ADMIN)

    # Attempt to create a user belonging to a different account.
    new_user_d = make_create_user_dict(make_account())
    res = Client(admin_user).create_user(new_user_d, False)

    # Check that the user was not created.
    assert res.status_code == HTTPStatus.FORBIDDEN
    with raises(User.DoesNotExist):
        User.objects.get(username=new_user_d["username"])


@mark.django_db
def test_non_admin_cant_create_user(make_account, make_user, make_create_user_dict):
    """Users with role=USER can not create users."""
    account = make_account()
    normal_user = make_user(account=account, role=UserRoles.USER)

    # Attempt to create the user.
    new_user_d = make_create_user_dict(account)
    res = Client(normal_user).create_user(new_user_d, False)

    # Check that the user was not created.
    assert res.status_code == HTTPStatus.FORBIDDEN
    with raises(User.DoesNotExist):
        User.objects.get(username=new_user_d["username"])


@mark.django_db
def test_admin_can_update_same_account_user(make_account, make_user):
    """Users with role=ADMIN can update a same-account user."""
    account = make_account()
    admin_user = make_user(account=account, role=UserRoles.ADMIN)
    normal_user = make_user(account=account, role=UserRoles.USER)

    # Update normal_user.
    new_email = "new@email.com"
    new_role = UserRoles.ADMIN
    assert normal_user.email != new_email
    res = Client(admin_user).update_user(
        normal_user, {"email": new_email, "role": new_role}
    )

    # Check that the user was updated.
    assert res.status_code == HTTPStatus.OK
    normal_user.refresh_from_db()
    assert normal_user.email == new_email
    assert normal_user.role == new_role


@mark.django_db
def test_admin_can_not_update_own_role(make_account, make_user):
    """Users with role=ADMIN can not update their own role."""
    admin_user = make_user(account=make_account(), role=UserRoles.ADMIN)
    res = Client(admin_user).update_user(admin_user, {"role": UserRoles.USER})
    assert res.status_code == HTTPStatus.FORBIDDEN
    assert res.json()["detail"] == "self role modification not allowed"


@mark.django_db
def test_admin_can_not_update_other_account_user(make_account, make_user):
    """Users with role=ADMIN can not update a user in a different account."""
    admin_user = make_user(account=make_account(), role=UserRoles.ADMIN)
    other_account_user = make_user(account=make_account(), role=UserRoles.USER)
    res = Client(admin_user).update_user(other_account_user, {"email": "new@email.com"})
    assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
def test_non_admin_can_update_self(make_account, make_user):
    """Users with role=USER are allowed to update themselves."""
    user = make_user(account=make_account(), role=UserRoles.USER)
    new_email = "new@email.com"
    assert new_email != user.email
    res = Client(user).update_user(user, {"email": new_email})
    assert res.status_code == HTTPStatus.OK
    user.refresh_from_db()
    assert user.email == new_email


@mark.django_db
def test_non_admin_cant_update_other_users(make_account, make_user):
    """Users with role=USER are not allowed to update anyone but themselves."""
    account = make_account()
    user = make_user(account=account, role=UserRoles.USER)

    # Test a same-account user.
    other_user = make_user(account=account, role=UserRoles.USER)
    res = Client(user).update_user(other_user, {"email": "new@email.com"})
    assert res.status_code == HTTPStatus.FORBIDDEN

    # Test a different-account user.
    other_user = make_user(account=make_account(), role=UserRoles.USER)
    res = Client(user).update_user(other_user, {"email": "new@email.com"})
    assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
@mark.parametrize("role", (UserRoles.ADMIN, UserRoles.USER))
def test_username_can_not_be_updated(role, make_account, make_user):
    """Updates to username are not allowed."""
    user = make_user(account=make_account(), role=role)
    old_username = user.username
    new_username = "new username"
    assert new_username != old_username
    res = Client(user).update_user(user, {"username": new_username})
    assert res.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    user.refresh_from_db()
    assert user.username == old_username
