export * from "./webservices/src/lib/helpers";
export { createElement } from "./webservices/src/legacy/lib/domLib";

import { UrlCollectionParamName, UrlCollectionsParamName } from "./constants";
import { Collection, Dataset, ProcessingState } from "./types";

export const identity = <T>(x: T) => x;

export const Paths = {
  collection: (id: Collection["id"]) => `/collections/${id}`,

  collections: `/collections`,

  dataset: (id: Dataset["id"]) => `/datasets/${id}`,

  datasets: `/datasets`,

  generateCollectionDataset: (collectionId: Collection["id"]) =>
    `/datasets/generate?${UrlCollectionParamName}=${collectionId}`,

  buildSubCollection: (sourceCollectionIds?: Array<Collection["id"]>) =>
    sourceCollectionIds === undefined
      ? "/collections/custom-collection-builder"
      : `/collections/custom-collection-builder?${sourceCollectionIds
          .map((x) => `${UrlCollectionsParamName}=${x}`)
          .join("&")}`,

  teams: "/account/teams",
};

export function isActiveProcessingState(state: ProcessingState): boolean {
  return (
    state === ProcessingState.SUBMITTED ||
    state === ProcessingState.QUEUED ||
    state === ProcessingState.RUNNING
  );
}

export function timestampStringToYearMonthString(timestamp: string): string {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString("default", {
    month: "short",
    year: "numeric",
  }); // eg. "Sep 2005"

  return formattedDate;
}

export function readableFacetName(facetName: string, facetField: string) {
  // convert camelcase name into a more readable form for f_organizationType field - eg. 'collegesAndUniversities' --> 'Colleges And Universities'
  if (facetField === "f_organizationType") {
    const nameWordsSeparated = facetName.split(/(?=[A-Z])/); // split on capital letter
    return nameWordsSeparated
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // capitalize each word and join with spaces
  } else {
    return facetName;
  }
}
