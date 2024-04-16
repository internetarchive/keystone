export * from "./webservices/src/lib/helpers";
import { Collection, Dataset, ProcessingState } from "./types";
export declare const identity: <T>(x: T) => T;
export declare const Paths: {
    collection: (id: Collection["id"]) => string;
    collections: string;
    dataset: (id: Dataset["id"]) => string;
    datasets: string;
    generateCollectionDataset: (collectionId: Collection["id"]) => string;
    buildSubCollection: (sourceCollectionIds?: Array<Collection["id"]>) => string;
};
export declare function isActiveProcessingState(state: ProcessingState): boolean;
