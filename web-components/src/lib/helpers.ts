export * from "./webservices/src/lib/helpers";
import { Collection, Dataset, ProcessingState } from "./types";
import { ArchSubCollectionBuilder } from "../archSubCollectionBuilder/index";
import { ArchGenerateDatasetForm } from "../archGenerateDatasetForm/index";

const _ = encodeURIComponent;

export const Paths = {
  collection: (id: Collection["id"]) => `/collections/${_(id)}`,

  dataset: (id: Dataset["id"]) => `/datasets/${_(id)}`,

  generateCollectionDataset: (collectionId: Collection["id"]) =>
    `/datasets/generate?${_(
      ArchGenerateDatasetForm.urlCollectionParamName
    )}=${_(collectionId)}`,

  buildSubCollection: (sourceCollectionIds?: Array<Collection["id"]>) =>
    sourceCollectionIds === undefined
      ? "/collections/custom-collection-builder"
      : `/collections/custom-collection-builder?${sourceCollectionIds
          .map(
            (x) =>
              `${_(ArchSubCollectionBuilder.urlCollectionsParamName)}=${_(x)}`
          )
          .join("&")}`,
};

export function isActiveProcessingState(state: ProcessingState): boolean {
  return (
    state === ProcessingState.SUBMITTED ||
    state === ProcessingState.QUEUED ||
    state === ProcessingState.RUNNING
  );
}
