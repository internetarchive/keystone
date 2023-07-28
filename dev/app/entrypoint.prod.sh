#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z "$KEYSTONE_POSTGRES_HOST" "$KEYSTONE_POSTGRES_PORT"; do
  sleep 0.1
done

echo "postgres started"

exec "$@"
