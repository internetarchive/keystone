import pytest
from pytest import mark
from django.core.exceptions import ValidationError
from keystone.validators import validate_username, validate_password


class TestValidators:
    wrapped_sha1_password = "pbkdf2_sha1$600000$05KGvXn9DPQcrDwEtdwlf6$wewpkSmJNdoggammlRfBF5dLu2gJu+KzuCIB0la1t6w="
    wrapped_sha256_password = "pbkdf2_sha256$600000$jCjYkxU6PyHPrpSZqEt2mK$67qp4LLjyoxiE2FsgoCTeNK+gWIvcby1dNasyBfOhRc="

    def test_validate_username(self):
        # does not raise error if value matches regex in method
        expected = None
        actual = validate_username("arch:test")
        assert expected == actual

    def test_validate_username_validation_error(self):
        # raises error if value does not match regex in method
        with pytest.raises(ValidationError) as error:
            validate_username("arch:test!")
            assert (
                "Username can only contain letters, digits, and special characters (@, ., +, -, :)."
                in error.info
            )

    @pytest.mark.parametrize(
        "is_valid,password,password_hash",
        [
            (True, "password", wrapped_sha256_password),
            (False, "password123", wrapped_sha256_password),
            (True, "password", wrapped_sha1_password),
            (False, "password123", wrapped_sha1_password),
        ],
    )
    def test_valid_password(self, is_valid, password, password_hash):
        assert is_valid == validate_password(password, password_hash)
