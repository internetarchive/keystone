import { callJsonApi } from "./fetch";
import { SolrData } from "../../lib/types";

export const MAX_SOLR_ROWS = 14000;

export function constructFinalSearchTerm(
  searchTerm: string,
  parsedFilters: string[]
) {
  // if search term and no filters, just use search term (which could be an empty string)
  if (parsedFilters.length === 0) {
    return searchTerm;
    // if one filter and no search term, use filter
  } else if (searchTerm === "") {
    return parsedFilters.join(" AND ");
    // if multiple filters and search term, join and use all values
  } else {
    return [...parsedFilters, searchTerm].join(" AND ");
  }
}

export function callSearchApi(
  finalSearchTerm: string,
  rowCount: number
): Promise<SolrData> {
  return callJsonApi<undefined, SolrData>({
    url: `/collection_surveyor/search/?q=${encodeURIComponent(
      finalSearchTerm
    )}&r=${encodeURIComponent(rowCount)}`,
    method: "GET",
    errorMessage: "error in collection surveyor search",
  });
}
