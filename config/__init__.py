import os
import sys


def django_manage():
    """Run Django management commands. This takes the place of the manage.py
    file created automatically for new Django projects. There is a hook in
    pyproject.toml to install this function as a script in the virtualenv.
    This allows you to run `manage.py` with the correct DJANGO_SETTINGS_MODULE
    from anywhere when the virtualenv is active."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
