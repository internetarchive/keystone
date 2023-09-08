import pytest
from keystone.hashers import PBKDF2WrappedSha1PasswordHasher
from django.core.exceptions import ValidationError


class TestHashers:
    plaintext_password = "password"
    sha1_hash_password = "sha1:5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"
    wrapped_sha1_password = "pbkdf2_sha1$600000$05KGvXn9DPQcrDwEtdwlf6$wewpkSmJNdoggammlRfBF5dLu2gJu+KzuCIB0la1t6w="

    def test_verify_true(self):
        expected = True
        actual = PBKDF2WrappedSha1PasswordHasher().verify(
            self.plaintext_password, self.wrapped_sha1_password
        )
        assert expected == actual

    def test_verify_false(self):
        expected = False
        actual = PBKDF2WrappedSha1PasswordHasher().verify(
            "password1234", self.wrapped_sha1_password
        )
        assert expected == actual
