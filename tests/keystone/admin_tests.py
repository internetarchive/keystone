import pytest
from pytest import mark
from model_bakery import baker
from django.contrib.admin.helpers import ACTION_CHECKBOX_NAME
from django.urls import reverse

from keystone.models import User, Account
from django.test import Client


class TestUserAdmin:
    @mark.django_db
    def test_wrap_password(self):
        """test that posting with wrap_sha1_passwords_of_selected_users action and selected checkboxes returns a 200"""
        account = baker.make(Account)
        user1 = baker.make(User, account=account)
        user2 = baker.make(User, account=account)
        admin_client = Client()

        change_url = reverse("admin:keystone_user_changelist")
        users = User.objects.all()
        data = {
            "action": "wrap_sha1_passwords_of_selected_users",
            ACTION_CHECKBOX_NAME: [user.pk for user in users],
        }
        response = admin_client.post(change_url, data, follow=True)
        assert response.status_code == 200
