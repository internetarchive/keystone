import re
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import PBKDF2PasswordHasher
from .hashers import PBKDF2WrappedSha1PasswordHasher


def validate_username(value):
    """Validate that a username contains only letters, numbers, and select special characters"""

    pattern = re.compile(r"^[\w.@+-:]+$")
    if not pattern.match(value):
        raise ValidationError(
            (
                "Username can only contain letters, digits, and special characters (@, ., +, -, :)."
            ),
            code="invalid_username",
        )


def validate_password(password, password_hash):
    """Validate that password matches password_hash"""

    supported_hashers = [
        PBKDF2PasswordHasher(),
        PBKDF2WrappedSha1PasswordHasher(),
    ]

    for hasher in supported_hashers:
        if password_hash.startswith(hasher.algorithm) and hasher.verify(
            password, password_hash
        ):
            return True

    return False
