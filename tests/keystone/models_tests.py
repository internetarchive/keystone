from model_bakery import baker
from pytest import mark
import pytest  # noqa

from keystone.models import ArchQuota, Account, User, Team, Collection
from .test_helpers import read_json_file


class TestCollection:
    @mark.django_db
    def test_get_for_user(self):
        # Given an account with one user
        account = baker.make(Account)
        user = baker.make(User, account=account)

        # ...and 4 collections
        collection1 = baker.make(Collection)
        collection2 = baker.make(Collection)
        collection3 = baker.make(Collection)
        unowned_collection = baker.make(Collection)

        # Make account-only, user-only, account+user associations (and one left out)
        account.collections.add(collection1, collection2)
        user.collections.add(collection2, collection3)

        # When we fetch all collections for the user we get all
        # account-only, user-only, and account+user associated collections
        # (without any duplicated collections)
        user_collections = Collection.get_for_user(user).all()
        expected = sorted([collection1, collection2, collection3], key=lambda x: x.id)
        actual = sorted(user_collections, key=lambda x: x.id)
        assert expected == actual


class TestArchQuota:
    @mark.django_db
    def test_fetch_for_user(self):
        # Given a user in two teams within an account
        account = baker.make(Account)
        team1 = baker.make(Team, account=account)
        team2 = baker.make(Team, account=account)
        user = baker.make(User, account=account)
        user.teams.add(team1, team2)
        # Where each of the user, their teams, and their accounts have a quota
        account_quota = baker.make(ArchQuota, content_object=account)
        team1_quota = baker.make(ArchQuota, content_object=team1)
        team2_quota = baker.make(ArchQuota, content_object=team2)
        user_quota = baker.make(ArchQuota, content_object=user)
        qsort = lambda x: x.id
        team_quotas = sorted([team1_quota, team2_quota], key=qsort)

        # When we fetch all quotas for the user
        quota_dict = ArchQuota.fetch_for_user(user)

        # Each of the user, their teams, and their account quotas return
        assert quota_dict[Account] == account_quota
        assert sorted(quota_dict[Team], key=qsort) == team_quotas
        assert quota_dict[User] == user_quota


class TestUser:
    user_data_json_file = "test_user_data.json"
    user_data = read_json_file(user_data_json_file)

    @mark.django_db
    def test_user_email_normalized_on_save(self, make_user):
        """User.email is normalized on save to prevent dupes."""
        user = make_user()
        orig_email = "userName@DOMAIN.COM"
        norm_email = "userName@domain.com"
        user.email = orig_email
        user.save()
        # Expect the domain to have been lowercased.
        assert user.email == norm_email
        user.refresh_from_db()
        assert user.email == norm_email

    @mark.django_db
    def test_create_users_from_data_dict_list(self):
        # Creates multiple User records from input data and returns None if transaction is successful
        account = baker.make(Account, id=1)
        error_message = User.create_users_from_data_dict_list(TestUser.user_data)
        users = User.objects.all()

        assert error_message == None
        assert users.count() == 2

    @mark.django_db
    def test_create_users_from_data_dict__list_transaction_rollback(self):
        # Rolls back the transaction and returns an error message if any or all Users already exist
        account = baker.make(Account, id=1)
        user = baker.make(
            User, username=TestUser.user_data[0]["username"], account=account
        )
        error_message = User.create_users_from_data_dict_list(TestUser.user_data)
        users = User.objects.all()

        assert error_message != None
        assert users.count() == 1
        assert User.objects.first().username == "testuser"
