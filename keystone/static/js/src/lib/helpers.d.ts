export * from "./webservices/src/lib/helpers";
export { createElement } from "./webservices/src/legacy/lib/domLib";
import { Collection, Dataset, ProcessingState } from "./types";
export declare const identity: <T>(x: T) => T;
export declare const Paths: {
    collection: (id: Collection["id"]) => string;
    collections: string;
    dataset: (id: Dataset["id"]) => string;
    datasets: string;
    generateCollectionDataset: (collectionId: Collection["id"]) => string;
    buildSubCollection: (sourceCollectionIds?: Array<Collection["id"]>) => string;
    teams: string;
};
export declare function isActiveProcessingState(state: ProcessingState): boolean;
export declare function timestampStringToYearMonthString(timestamp: string): string;
export declare function readableFacetName(facetName: string, facetField: string): string;
