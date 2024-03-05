import psycopg

from config import settings


###############################################################################
# Constants
###############################################################################


USER_COLUMNS = ("id", "account_id", "email", "full_name", "password_hash", "username")

COLLECTION_COLUMNS = (
    "id",
    "account_id",
    "name",
    "publicly_visible",
    "total_warc_bytes",
    "num_active_seeds",
    "num_inactive_seeds",
    "last_crawl_date",
)


###############################################################################
# Helpers
###############################################################################


def query_ait_db(stmt, params=()):
    """Query the AIT database."""
    conn = psycopg.connect(
        f"""
    host={settings.AIT_DB_HOST}
    port={settings.AIT_DB_PORT}
    user={settings.AIT_DB_USER}
    dbname={settings.AIT_DB_NAME}
    """
    )
    # Set the connection to read-only.
    conn.read_only = True
    return conn.execute(stmt, params).fetchall()


###############################################################################
# User Table Query Functions
###############################################################################


def query_users_table(where_col_name, where_col_val):
    """Query the AIT users table by the specified whereclause column and value."""
    if where_col_name not in ("id", "account_id"):
        raise ValueError(f"unsupported whereclause column: {where_col_name}")
    users = [
        dict(zip(USER_COLUMNS, vs))
        for vs in query_ait_db(
            f"select {', '.join(USER_COLUMNS)} from users where {where_col_name}=%s",
            (where_col_val,),
        )
    ]
    # Transform non-empty full_name into first_name and last_name.
    for user in users:
        full_name = user.pop("full_name")
        user["first_name"], user["last_name"] = "", ""
        if not full_name:
            continue
        splits = full_name.split(" ", 1)
        splits_len = len(splits)
        if splits_len == 1:
            user["first_name"] = splits[0]
        elif splits_len == 2:
            user["first_name"], user["last_name"] = splits
    return users


def get_ait_user_info(user_id):
    """Return an info dict for a single AIT user."""
    users = query_users_table("id", user_id)
    return users[0] if users else None


def get_ait_account_users_info(account_id):
    """Return a list of info dicts for users belonging to an AIT account."""
    return query_users_table("account_id", account_id)


###############################################################################
# Collection Table Query Functions
###############################################################################


def query_collection_table(where_col_name, where_col_val):
    """Query the AIT collection table by the specified whereclause column and value."""
    if where_col_name not in ("id", "account_id"):
        raise ValueError(f"unsupported whereclause column: {where_col_name}")
    return [
        dict(zip(COLLECTION_COLUMNS, vs))
        for vs in query_ait_db(
            f"select {', '.join(COLLECTION_COLUMNS)} from collection where {where_col_name}=%s",
            (where_col_val,),
        )
    ]


def get_ait_collection_info(collection_id):
    """Return an info dict for a single AIT collection."""
    collections = query_collection_table("id", collection_id)
    return collections[0] if collections else None


def get_ait_account_collections_info(account_id):
    """Return a list of info dicts for collections belonging to an AIT account."""
    return query_collection_table("account_id", account_id)
