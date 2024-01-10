import requests


class SolrClient:
    """Client for Solr"""

    def __init__(self, solr_url, core):
        """
        Initializes the Solr client with the URL of the Solr
        instance and the core or collection name.
        :param solr_url: Base URL to the Solr instance.
        :param core: Name of the Solr core or collection.
        """
        self.solr_url = solr_url.rstrip("/")
        self.core = core

    def search(self, query="*:*", rows=10, fq=None, facet_fields=None):
        """
        Performs a search query in Solr and optionally facets on the given fields.
        :param query: The search query.
        :param rows: Number of rows of documents to return.
        :param facet_fields: List of fields to facet on.
        :return: Parsed response from Solr.
        """
        timeout_seconds = 10

        # Construct the search URL
        search_url = f"{self.solr_url}/{self.core}/select"

        # Set up the parameters for the search query
        params = {"q": query, "rows": rows, "wt": "json"}  # Response format set to JSON

        # If filter queries are specified, add them to the parameters
        if fq:
            if isinstance(fq, list):
                params["fq"] = fq
            else:
                params["fq"] = [fq]

        # If faceting is enabled, add the facet parameters
        if facet_fields:
            params["facet"] = "true"
            # Add each field to facet on
            for field in facet_fields:
                params.setdefault("facet.field", []).append(field)

        # Make the GET request to the Solr server
        response = requests.get(search_url, params=params, timeout=timeout_seconds)

        # Return the parsed response
        return response.json()
