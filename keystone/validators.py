import re

from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import PBKDF2PasswordHasher
from pydantic.error_wrappers import ValidationError as PydanticValidationError

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


def validate_and_clean_collection_metadata(metadata, collection=None):
    """Raise a ValidationError if metadata doesn't match any defined API schema.
    If a collection instance is specified, which is true when invoked from
    Collection.save() but not during form field validation, validate only against
    the single collection_type-specific schema."""
    # pylint: disable=cyclic-import
    from .api import (
        AITCollectionMetadata,
        CustomCollectionMetadata,
        SpecialCollectionMetadata,
    )
    from .models import CollectionTypes

    if not metadata:
        return metadata
    if collection is None:
        schemas = (
            AITCollectionMetadata,
            CustomCollectionMetadata,
            SpecialCollectionMetadata,
        )
    elif collection.collection_type == CollectionTypes.AIT:
        schemas = (AITCollectionMetadata,)
    elif collection.collection_type == CollectionTypes.CUSTOM:
        schemas = (CustomCollectionMetadata,)
    elif collection.collection_type == CollectionTypes.SPECIAL:
        schemas = (SpecialCollectionMetadata,)
    else:
        raise NotImplementedError(collection.collection_type)
    num_schemas = len(schemas)
    for schema in schemas:
        try:
            return schema.validate(metadata).dict(exclude_none=True)
        except PydanticValidationError as e:
            if num_schemas == 1:
                raise ValidationError(str(e)) from e
    raise ValidationError(f"metadata does not match any defined schema: {metadata}")
