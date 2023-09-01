import pytest

from keystone.helpers import parse_csv
from .test_helpers import upload_csv_file, read_json_file


user_data_csv_file = "bulk_add_users_test_data.csv"
user_data_json_file = "test_user_data.json"


def test_parse_csv_with_imported_data():
    # parse_csv returns the expected list of dictionaries of user data
    uploaded_csv = upload_csv_file(user_data_csv_file)
    actual = parse_csv(uploaded_csv)
    expected = read_json_file(user_data_json_file)
    assert expected == actual
