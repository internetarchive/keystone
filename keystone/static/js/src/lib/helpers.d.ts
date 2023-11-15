export * from "./webservices/src/lib/helpers";
import { Collection, Dataset, ProcessingState } from "./types";
export declare const Paths: {
    collection: (id: Collection["id"]) => string;
    dataset: (id: Dataset["id"]) => string;
    generateCollectionDataset: (collectionId: Collection["id"]) => string;
    buildSubCollection: (sourceCollectionIds?: Array<Collection["id"]>) => string;
};
export declare function isActiveProcessingState(state: ProcessingState): boolean;
