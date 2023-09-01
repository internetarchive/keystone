import os
import json
from django.core.files.uploadedfile import SimpleUploadedFile


def upload_csv_file(filename):
    """create an uploaded csv file"""
    filepath = get_filepath(filename)

    with open(filepath, "rb") as csv_file:
        csv_content = csv_file.read()

    uploaded_csv = SimpleUploadedFile("file.csv", csv_content)

    return uploaded_csv


def read_json_file(filename):
    """create a dictionary from uploaded json data"""
    filepath = get_filepath(filename)

    with open(filepath, "r") as json_file:
        json_data = json.load(json_file)

    return json_data


def get_filepath(filename):
    """get current directory and concat with filepath"""
    current_directory = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_directory, filename)

    return file_path
