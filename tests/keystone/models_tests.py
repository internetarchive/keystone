from model_bakery import baker
from pytest import mark
import pytest  # noqa

from keystone.models import ArchQuota, Account, User, Team


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
