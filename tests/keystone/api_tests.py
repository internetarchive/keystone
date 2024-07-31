import json
from http import HTTPStatus
from unittest.mock import patch

from django.forms import model_to_dict
from django.test import Client as _Client
from model_bakery import baker
from pytest import (
    fixture,
    mark,
    raises,
)

from config.settings import GLOBAL_USER_USERNAME
from keystone.api import CreateUserSchema
from keystone.models import (
    Dataset,
    Team,
    User,
    UserRoles,
)


###############################################################################
# Fixtures
###############################################################################


@fixture
def make_create_user_dict(make_team):
    def f(account):
        prepared_user = baker.prepare(User, account=account)
        teams = [make_team(account=account), make_team(account=account)]
        return {
            k: getattr(prepared_user, k)
            for k in CreateUserSchema.schema()["properties"].keys()
            if k != "teams"
        } | {"teams": [model_to_dict(t) for t in teams]}

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

    def list_teams(self):
        return self.get("/api/teams")

    def create_team(self, team_d):
        return self.put(
            f"/api/teams",
            team_d,
            "application/json",
        )

    def update_team(self, team, update_d):
        return self.patch(f"/api/teams/{team.id}", update_d, "application/json")

    def list_datasets(self):
        return self.get(f"/api/datasets")

    def get_dataset(self, dataset_id):
        return self.get(f"/api/datasets/{dataset_id}")

    def update_dataset_teams(self, dataset_id, teams):
        return self.post(
            f"/api/datasets/{dataset_id}/teams",
            [{"id": t.id, "name": t.name} for t in teams],
            "application/json",
        )


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
        if k == "teams":
            assert set(new_user.teams.values_list("id", flat=True)) == {
                t["id"] for t in v
            }
        else:
            assert getattr(new_user, k) == v

    # Check that a welcome email was sent.
    if not send_welcome_email:
        jobmail_send.assert_not_called()
    else:
        jobmail_send.assert_called_once()
        jobmail_send_call_args = jobmail_send.call_args
        assert jobmail_send_call_args.args[0] == "new_user_welcome_email"
        assert jobmail_send_call_args.kwargs["context"]["user"] == new_user
        assert jobmail_send_call_args.kwargs["subject"] == "Welcome to ARCH!"
        assert jobmail_send_call_args.kwargs["to"] == new_user.email


@mark.django_db
@mark.parametrize("role", (UserRoles.ADMIN, UserRoles.USER))
def test_no_user_can_create_other_account_user(
    role, make_account, make_user, make_create_user_dict
):
    """No user is allowed to create a user in a different account."""
    account = make_account()
    user = make_user(account=account, role=role)

    # Attempt to create a user belonging to a different account.
    new_user_d = make_create_user_dict(make_account())
    res = Client(user).create_user(new_user_d, False)

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
def test_admin_can_update_own_teams(make_account, make_user, make_team):
    """Users with role=ADMIN can update their own teams."""
    admin_user = make_user(account=make_account(), role=UserRoles.ADMIN)
    team = make_team(account=admin_user.account)
    res = Client(admin_user).update_user(admin_user, {"teams": [model_to_dict(team)]})
    assert res.status_code == HTTPStatus.OK
    admin_user.refresh_from_db()
    assert tuple(admin_user.teams.all()) == (team,)


@mark.django_db
@mark.parametrize("role", (UserRoles.ADMIN, UserRoles.USER))
def test_no_user_can_update_other_account_user(role, make_account, make_user):
    """No user is allowed to update another account's user."""
    user = make_user(account=make_account(), role=role)
    other_account_user = make_user(account=make_account(), role=UserRoles.USER)
    res = Client(user).update_user(other_account_user, {"email": "new@email.com"})
    assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
def test_non_admin_can_update_self(make_account, make_user):
    """Users with role=USER are allowed to update themselves less role and teams."""
    user = make_user(account=make_account(), role=UserRoles.USER)
    new_email = "new@email.com"
    assert new_email != user.email
    res = Client(user).update_user(user, {"email": new_email})
    assert res.status_code == HTTPStatus.OK
    user.refresh_from_db()
    assert user.email == new_email


@mark.django_db
def test_non_admin_can_not_update_own_role(make_user, make_team):
    """Users with role=USER are not allowed to update their own role."""
    user = make_user(role=UserRoles.USER)
    res = Client(user).update_user(user, {"role": UserRoles.ADMIN})
    assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
def test_non_admin_can_not_update_own_teams(make_user, make_team):
    """Users with role=USER are not allowed to update their own teams."""
    user = make_user(role=UserRoles.USER)
    team = make_team(account=user.account)
    res = Client(user).update_user(user, {"teams": [model_to_dict(team)]})
    assert res.status_code == HTTPStatus.FORBIDDEN


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


###############################################################################
# /api/teams tests
###############################################################################


@mark.django_db
def test_any_user_can_list_account_teams(make_user, make_team):
    """Any user can list their account's teams"""
    # Create a user on a team.
    user = make_user()
    team1 = make_team(account=user.account)
    user.teams.add(team1)
    # Create a second account team of which the user is not a member.
    team2 = make_team(account=user.account)
    # Create a different-account team.
    other_account_team = make_team()
    # Check that the user can list its account teams.
    res = Client(user).list_teams()
    assert res.status_code == HTTPStatus.OK
    assert {x["id"] for x in res.json()["items"]} == {team1.id, team2.id}


@mark.django_db
def test_admin_can_create_same_account_team(make_user):
    """An ADMIN-type user can create an account team."""
    user = make_user(role=UserRoles.ADMIN)
    team_name = baker.prepare(Team).name
    client = Client(user)
    assert client.list_teams().json()["items"] == []
    res = client.create_team({"account_id": user.account.id, "name": team_name})
    assert res.status_code == HTTPStatus.CREATED
    assert {x["name"] for x in client.list_teams().json()["items"]} == {team_name}


@mark.django_db
def test_admin_can_not_create_different_account_team(make_account, make_user):
    """An ADMIN-type user can not create a team in a different account."""
    user = make_user(role=UserRoles.ADMIN)
    other_account = make_account()
    res = Client(user).create_team({"account_id": other_account.id, "name": "test"})
    assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
def test_non_admin_not_create_any_team(make_account, make_user):
    """A normal user can not create a team in their own or other account."""
    user = make_user()
    for account in (user.account, make_account()):
        res = Client(user).create_team({"account_id": account.id, "name": "test"})
        assert res.status_code == HTTPStatus.FORBIDDEN


@mark.django_db
def test_admin_can_edit_account_team(make_user, make_team):
    """An ADMIN-type user can edit an account team."""
    user = make_user(role=UserRoles.ADMIN)
    team = make_team(account=user.account)
    new_name = baker.prepare(Team).name
    assert new_name != team.name
    client = Client(user)
    res = client.update_team(team, {"name": new_name})
    assert res.status_code == HTTPStatus.OK
    assert {x["name"] for x in client.list_teams().json()["items"]} == {new_name}


@mark.django_db
@mark.parametrize("role", (UserRoles.ADMIN, UserRoles.USER))
def test_no_user_can_edit_other_account_team(role, make_user, make_team):
    """No user is allowed to edit another account's team."""
    user = make_user(role=role)
    team = make_team()
    res = Client(user).update_team(team, {"name": "test"})
    assert res.status_code == HTTPStatus.FORBIDDEN


###############################################################################
# /api/datasets tests
###############################################################################


@mark.django_db
def test_dataset_owner_team_global_access(
    make_team, make_user, make_user_dataset, make_collection, global_datasets_user
):
    """A dataset can only be accessed:
    - by its owner
    - by the members of any team for which the dataset has been authorized
    - if it's owned by the global datasets user and the requesting user is
      authorized to access the associated collection
    """
    # Create a user and add them to a team.
    user = make_user()
    team = make_team(account=user.account)
    user.teams.add(team)

    # Create a second same-account user, and a different-account user.
    other_user = make_user(account=user.account)
    other_account_user = make_user()

    # Create a couple of user datasets.
    user_dataset_ids = [make_user_dataset(user).id, make_user_dataset(user).id]

    # Create a collection to which both 'user' and the global_datasets_user have access
    # and create an associated global-user-owned dataset.
    global_collection = make_collection()
    global_collection.users.set((global_datasets_user, user))
    global_dataset = make_user_dataset(
        global_datasets_user, collection=global_collection
    )
    user_dataset_ids.append(global_dataset.id)

    def check_access(_user, list_result_ids, get_test_id, get_test_ok):
        """Check a user's ability to list and retrieve datasets."""
        client = Client(_user)
        res = client.list_datasets()
        assert res.status_code == HTTPStatus.OK
        assert {x["id"] for x in res.json()["items"]} == set(list_result_ids)
        res = client.get_dataset(get_test_id)
        assert res.status_code == (
            HTTPStatus.OK if get_test_ok else HTTPStatus.NOT_FOUND
        )

    # Check that the user can list and retrieve their own datasets.
    check_access(user, user_dataset_ids, user_dataset_ids[0], True)

    # Check that the other users can't do either.
    check_access(other_user, [], user_dataset_ids[0], False)
    check_access(other_account_user, [], user_dataset_ids[0], False)

    # Add the same-account user to the same team and check that they still don't
    # have access since the team is not yet authorized to access any datasets.
    other_user.teams.add(team)
    check_access(other_user, [], user_dataset_ids[0], False)

    # Authorize the team to access the first dataset.
    dataset = Dataset.objects.get(id=user_dataset_ids[0])
    dataset.teams.add(team)
    dataset.save()

    # Check that the same-account user can now access the dataset.
    check_access(other_user, [dataset.id], dataset.id, True)

    # Remove user from the team and check that, even though the dataset is still
    # authorized for the team, since the owning user is no longer on the team, the
    # team (i.e. other_user) no longer has access.
    user.teams.remove(team)
    user.save()
    check_access(other_user, [], dataset.id, False)

    # Check that adding the user and authorizing the dataset for a completely
    # different team doesn't restore other_user's access.
    other_team = make_team()
    user.teams.add(other_team)
    user.save()
    dataset.teams.add(other_team)
    dataset.save()
    check_access(other_user, [], dataset.id, False)

    # Check that adding other_user to other_team restores their access.
    other_user.teams.add(other_team)
    other_user.save()
    check_access(other_user, [dataset.id], dataset.id, True)


@mark.django_db
def test_dataset_owner_can_update_teams(make_team, make_user, make_user_dataset):
    """A dataset owner can update the teams with which the dataset is shared."""
    user = make_user()
    team1 = make_team(account=user.account)
    team2 = make_team(account=user.account)
    team3 = make_team(account=user.account)
    user.teams.set((team1, team2))
    dataset = make_user_dataset(user)
    res = Client(user).update_dataset_teams(dataset.id, [team1, team2])
    assert res.status_code == HTTPStatus.NO_CONTENT
    dataset_teams = set(dataset.teams.values_list("id", flat=True))
    assert dataset_teams == {team1.id, team2.id}


@mark.django_db
def test_dataset_owner_can_not_update_teams_with_nonmember_team(
    make_team, make_user, make_user_dataset
):
    """A dataset owner is not allowed to share a dataset to a team of which they're
    not a member."""
    user = make_user()
    team = make_team(account=user.account)
    dataset = make_user_dataset(user)
    res = Client(user).update_dataset_teams(dataset.id, [team])
    assert res.status_code == HTTPStatus.BAD_REQUEST
    assert res.json()["detail"] == f"Invalid team ID(s): [{team.id}]"


@mark.django_db
def test_non_dataset_owner_can_not_update_teams(
    make_team, make_user, make_user_dataset
):
    """A user is not allowed to update the teams of a dataset that they don't own."""
    # Create a dataset owner and dataset.
    owner = make_user()
    dataset = make_user_dataset(owner)
    # Create a non-owner user, put them on a team with owner, and authorize the team to
    # access the dataset so that the dataset lookup in the API doesn't result in a 404.
    non_owner = make_user(account=owner.account)
    team = make_team(account=owner.account)
    team.members.set((owner, non_owner))
    dataset.teams.set((team,))
    # Check that the attempt by the non-owner to authorize the dataset for the team
    # is forbidden.
    res = Client(non_owner).update_dataset_teams(dataset.id, [team])
    assert res.status_code == HTTPStatus.FORBIDDEN
