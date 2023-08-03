import pytest
from django.core.exceptions import ValidationError
from keystone.validators import validate_username


class TestValidators:
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
