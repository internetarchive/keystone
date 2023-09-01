from model_bakery import baker
from pytest import mark
import pytest

from django.urls import reverse
from keystone import views
from keystone.models import User, Account


class TestBulkAddUser:
    PATH = reverse("bulk_add_users")

    @property
    def View(self):
        return views.bulk_add_users

    @mark.django_db
    def test_basic_template_response_200(self, rf):
        # An authorized GET responds with HTML
        account = baker.make(Account)
        request = rf.get(self.PATH)
        request.user = baker.make(User, is_staff=True, account=account)
        response = self.View(request)
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/html")

    @mark.django_db
    def test_basic_template_response_403(self, rf):
        # An unauthorized GET responds with a 403 error
        account = baker.make(Account)
        request = rf.get(self.PATH)
        request.user = baker.make(User, is_staff=False, account=account)
        response = self.View(request)
        assert response.status_code == 403
