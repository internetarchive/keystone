from http import HTTPStatus
from pathlib import Path
from time import sleep

import requests

from django.core.management import call_command

from keystone.models import (
    Account,
    Collection,
    CollectionTypes,
    User,
    UserRoles,
)


DEFAULT_ACCOUNT_NAME = "General"
DEFAULT_USERS = (
    {
        "username": "system",
        "password": "password",
        "email": "system@keystone.local",
        "is_superuser": True,
        "is_staff": True,
        "role": UserRoles.ADMIN,
    },
    {
        "username": "admin",
        "password": "password",
        "email": "admin@keystone.local",
        "is_superuser": False,
        "is_staff": False,
        "role": UserRoles.ADMIN,
    },
    {
        "username": "test",
        "password": "password",
        "email": "test@keystone.local",
        "is_superuser": False,
        "is_staff": False,
        "role": UserRoles.USER,
    },
)
DEFAULT_COLLECTIONS = (
    {
        "arch_id": "SPECIAL-test-collection",
        "collection_type": CollectionTypes.SPECIAL,
        "name": "Test Collection",
        "size_bytes": 1023207,
    },
)


def collectstatic():
    """Run the collectstatic management command."""
    call_command("collectstatic", no_input=True, interactive=False)


def migrate():
    """Run the migrate management command."""
    call_command("migrate")


def ensure_default_account():
    """Ensure that a default Account exists and return it."""
    try:
        return Account.objects.get(name=DEFAULT_ACCOUNT_NAME)
    except Account.DoesNotExist:
        account = Account.objects.create(name=DEFAULT_ACCOUNT_NAME)
        print(
            f"Created default account with id ({account.id}) and name ({account.name})"
        )
        return account


def ensure_users(account):
    """Create the default users as necessary and return them."""
    for user_d in DEFAULT_USERS:
        kwargs = {"account": account} | {
            k: v for k, v in user_d.items() if k != "password"
        }
        if not User.objects.filter(**kwargs).exists():
            user = User.objects.create(**kwargs)
            user.set_password(user_d["password"])
            user.save()
            print(f"Created user: {kwargs}")
    return User.objects.filter(
        username__in={d["username"] for d in DEFAULT_USERS}
    ).all()


def ensure_collections(users):
    """Create the default collections."""
    for collection_d in DEFAULT_COLLECTIONS:
        try:
            collection = Collection.objects.get(**collection_d)
        except Collection.DoesNotExist:
            collection = Collection.objects.create(**collection_d)
            print(f"Created collection: {collection_d}")
        collection.users.set(users)


def wait_for_arch():
    """Wait for the ARCH webserver to become available, as indicated by a 403
    response from http://arch:12341"""
    while True:
        print("Waiting for ARCH...")
        res = None
        try:
            res = requests.head("http://arch:12341")
        except requests.exceptions.ConnectionError:
            pass
        if res is not None and res.status_code == HTTPStatus.FORBIDDEN:
            return
        sleep(2)


def import_arch_job_types():
    """Run the import_arch_job_types management command."""
    call_command("import_arch_job_types")


def import_and_update_local_collections(users):
    """Ensure that all local collections in /opt/arch/shared/in/collections
    are represented in the database and that size_bytes is up-to-date."""
    for collection_path in (
        p for p in Path("/opt/arch/shared/in/collections").glob("*") if p.is_dir()
    ):
        # Convert kebab-case directory name to title-case collection name.
        collection_dir = collection_path.name
        collection_name = " ".join(s.title() for s in collection_dir.split("-"))
        size_bytes = sum(x.stat().st_size for x in collection_path.glob("*arc.gz"))
        # Create the collection if it doesn't exist.
        if not Collection.objects.filter(name=collection_name).exists():
            collection = Collection.objects.create(
                arch_id=f"SPECIAL-{collection_dir}",
                collection_type=CollectionTypes.SPECIAL,
                name=collection_name,
                size_bytes=size_bytes,
            )
            # Provide access to all default users.
            collection.users.set(users)
            print(f"Imported local collection: {collection_name}")
        else:
            collection = Collection.objects.get(name=collection_name)
        if collection.size_bytes != size_bytes:
            collection.size_bytes = size_bytes
            collection.save()
            print(f"Update size_bytes for local collection: {collection_name}")


# Do the initialization steps.
collectstatic()
migrate()
account = ensure_default_account()
users = ensure_users(account)
ensure_collections(users)
wait_for_arch()
import_arch_job_types()
import_and_update_local_collections(users)
