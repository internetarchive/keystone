#!/bin/bash
set -e

/home/keystone/venv/bin/django-admin shell < /entrypoint.py

exec "$@"
