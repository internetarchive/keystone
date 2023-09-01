import csv


def parse_csv(csv_file):
    """Create a list of dictionaries of data from a csv file"""

    decoded_file = csv_file.read().decode("utf-8")
    csv_dict = csv.DictReader(decoded_file.splitlines())

    return list(csv_dict)
