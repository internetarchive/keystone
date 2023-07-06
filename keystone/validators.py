import re
from django.core.exceptions import ValidationError


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
