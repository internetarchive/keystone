from model_bakery import baker
from pytest import mark
import pytest  # noqa

from keystone.models import ArchQuota, Account, User, Team, Collection


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
        user_collections = Collection.get_for_user(user)
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
