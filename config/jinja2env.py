from django.templatetags.static import static
from django.urls import reverse

from jinja2 import Environment


def environment(**options):
    """Add the `static` and `url` functions to Jinja2 templates."""
    env = Environment(**options)
    env.globals.update(
        {
            "static": static,
            "url": reverse,
        }
    )
    return env
