import psycopg

from config import settings


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


USER_COLUMNS = ("id", "account_id", "email", "full_name", "password_hash", "username")


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
    # Transform full_name into first_name and last_name.
    for user in users:
        match user.pop("full_name").split(" ", 1):
            case [first, last]:
                user["first_name"], user["last_name"] = first, last
            case [first]:
                user["first_name"], user["last_name"] = first, ""
    return users


def get_ait_user_info(user_id):
    """Return an info dict for a single AIT user."""
    users = query_users_table("id", user_id)
    return users[0] if users else None


def get_ait_account_users_info(account_id):
    """Return a list of info dicts for users belonging to an AIT account."""
    return query_users_table("account_id", account_id)


def get_ait_account_collection_ids(account_id):
    """Return the list of non-deleted collection IDs for the specified account."""
    return [
        int(vals[0])
        for vals in query_ait_db(
            "select id from collection where account_id=%s and not deleted",
            (account_id,),
        )
    ]
