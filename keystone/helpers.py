import csv


def parse_csv(csv_file):
    """Create a list of dictionaries of data from a csv file"""

    decoded_file = csv_file.read().decode("utf-8")
    csv_dict = csv.DictReader(decoded_file.splitlines())

    return list(csv_dict)


def parse_solr_facet_data(facets):
    """For each solr facet, parse the list of values into a list of
    dictionaries with name, count keys, eg.
    input:  {
        "f_collectionName": ["Test", 24, "Covid-19", 21],
        "f_organizationName": ["Williams College", 264, "New York University", 111],
    }
    output: {
        "f_collectionName": [{ name: "Test", count: 24}, {name: "Covid-19", count: 21}],
        "f_organizationName": [
            {name: "Williams College", count: 264},
            {name: "New York University", count: 111}
        ],
    }
    """

    parsed_facets = {}

    for field, values in facets.items():
        pairs = [values[i : i + 2] for i in range(0, len(values), 2)]
        facet_field_list = [{"name": name, "count": count} for name, count in pairs]

        parsed_facets[field] = facet_field_list

    return parsed_facets
