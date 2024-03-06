export * from "./webservices/src/lib/helpers";

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
};

export function isActiveProcessingState(state: ProcessingState): boolean {
  return (
    state === ProcessingState.SUBMITTED ||
    state === ProcessingState.QUEUED ||
    state === ProcessingState.RUNNING
  );
}
