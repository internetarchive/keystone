import functools
import csv
from uuid import UUID

from django.core.exceptions import FieldDoesNotExist
from django.db import models
import sentry_sdk


def is_uuid7(s):
    """Return a bool indicate whether a string is a valid UUID7."""
    try:
        return UUID(s).version == 7
    except ValueError:
        return False


def parse_csv(csv_file):
    """Create a list of dictionaries of data from a csv file"""

    decoded_file = csv_file.read().decode("utf-8")
    csv_dict = csv.DictReader(decoded_file.splitlines())

    return list(csv_dict)


def parse_solr_facet_data(facets):
    """For each solr facet, parse the list of values into a list of
    dictionaries with name, count keys, eg.
    input:  {
        "f_collectionName": ["Test", 24, "Covid-19", 21],
        "f_organizationName": ["Williams College", 264, "New York University", 111],
    }
    output: {
        "f_collectionName": [{ name: "Test", count: 24}, {name: "Covid-19", count: 21}],
        "f_organizationName": [
            {name: "Williams College", count: 264},
            {name: "New York University", count: 111}
        ],
    }
    """

    parsed_facets = {}

    for field, values in facets.items():
        pairs = [values[i : i + 2] for i in range(0, len(values), 2)]
        facet_field_list = [{"name": name, "count": count} for name, count in pairs]

        parsed_facets[field] = facet_field_list

    return parsed_facets


def dot_to_dunder(s):
    """Replace all occurences of '.' with '__'"""
    return s.replace(".", "__")


# Adapted from: https://stackoverflow.com/a/75751667
def find_field_from_lookup(model_class: models.Model, lookup: str) -> models.Field:
    """Find field object from a lookup, which can span relationships.

    Example: `"book__author__name"` would return the `name` field of the `Author` model.

    Raises `FieldDoesNotExist` when the lookup is not valid.
    """
    field_names = list(reversed(lookup.split("__")))
    if not field_names or not model_class:
        raise FieldDoesNotExist(lookup)
    while model_class and field_names:
        field_name = field_names.pop()
        field = model_class._meta.get_field(field_name)
        # If field is a JSONField, which supports internal indexing,
        # return it.
        if isinstance(field, models.JSONField):
            return field
        model_class = field.related_model
        if field_names and not model_class:
            raise FieldDoesNotExist(lookup)
    return field


def report_exceptions(*exceptions):
    """Decorator to report otherwise handled exceptions to Sentry"""
    if not exceptions:
        exceptions = Exception

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except exceptions as e:
                sentry_sdk.capture_exception(e)
                raise

        return wrapper

    return decorator
