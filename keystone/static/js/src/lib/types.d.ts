import { JSONSchemaType } from "ajv";
import { SomeJSONSchema } from "ajv/lib/types/json-schema";
export type Collection = {
    id: string;
    name: string;
    public: boolean;
    lastJobId?: string;
    lastJobSample?: boolean;
    lastJobTime?: Date;
    size: string;
    sortSize: number;
    seeds: number;
    lastCrawlDate: Date;
};
export interface CollectionSearchResult {
    organizationId: number;
    organizationName: string;
    collectionName: string;
    collectionId: number;
    meta_Description?: string;
    totalWarcBytes: number;
}
export interface CollectionCheckboxEventDetail {
    collectionSize: string;
    isChecked: boolean;
    collectionName: string;
    collectionId: string;
}
export interface CollectionSelectedDetail {
    collectionSize: string;
    collectionId: string;
}
export interface Facets {
    [key: string]: Array<string | number>;
}
export interface FacetResultMap {
    name: string;
    count: number;
}
export type Dataset = {
    category: string;
    collectionId: string;
    collectionName: string;
    finishedTime?: Date;
    id: string;
    isSample: boolean;
    jobId: string;
    name: string;
    numFiles: number;
    sample: number;
    startTime?: Date;
    state: string;
};
export declare enum JobId {
    ArsLgaGeneration = "ArsLgaGeneration",
    ArsWaneGeneration = "ArsWaneGeneration",
    ArsWatGeneration = "ArsWatGeneration",
    AudioInformationExtraction = "AudioInformationExtraction",
    DomainFrequencyExtraction = "DomainFrequencyExtraction",
    DomainGraphExtraction = "DomainGraphExtraction",
    ImageGraphExtraction = "ImageGraphExtraction",
    ImageInformationExtraction = "ImageInformationExtraction",
    PdfInformationExtraction = "PdfInformationExtraction",
    PresentationProgramInformationExtraction = "PresentationProgramInformationExtraction",
    SpreadsheetInformationExtraction = "SpreadsheetInformationExtraction",
    TextFilesInformationExtraction = "TextFilesInformationExtraction",
    VideoInformationExtraction = "VideoInformationExtraction",
    WebGraphExtraction = "WebGraphExtraction",
    WebPagesExtraction = "WebPagesExtraction",
    WordProcessorInformationExtraction = "WordProcessorInformationExtraction"
}
export type Job = {
    id: JobId;
    name: string;
    description: string;
};
export type AvailableJobs = Array<{
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
    categoryId: string;
    jobs: Array<Job>;
}>;
export declare enum ProcessingState {
    NotStarted = "Not started",
    Queued = "Queued",
    Running = "Running",
    Finished = "Finished",
    Failed = "Failed"
}
export type JobState = {
    id: string;
    name: string;
    sample: number;
    state: ProcessingState;
    started: boolean;
    finished: boolean;
    failed: boolean;
    activeStage: string;
    activeState: ProcessingState;
    startTime?: string;
    finishedTime?: string;
};
export type PublishedDatasetInfo = {
    item: string;
    source: string;
    collection: string;
    job: JobId;
    complete: boolean;
    sample: boolean;
    time: Date;
    ark: string;
};
export type PublishedDatasetMetadataApiResponse = {
    creator?: Array<string>;
    description?: Array<string>;
    licenseurl?: Array<string>;
    subject?: Array<string>;
    title?: Array<string>;
};
export type PublishedDatasetMetadata = {
    creator?: Array<string>;
    description?: string;
    licenseurl?: string;
    subject?: Array<string>;
    title?: string;
};
export type PublishedDatasetMetadataValue = PublishedDatasetMetadata[keyof PublishedDatasetMetadata];
export type PublishedDatasetMetadataJSONSchema = JSONSchemaType<PublishedDatasetMetadata>;
export type PublishedDatasetMetadataJSONSchemaProps = Record<keyof PublishedDatasetMetadata, SomeJSONSchema>;
export type BaseFilteredApiResponse<T> = {
    count: number;
    results: T;
};
type FilteredApiResults<T> = Array<T>;
type DistinctApiResults<T> = Array<T[keyof T]>;
export type FilteredApiResponse<T> = BaseFilteredApiResponse<FilteredApiResults<T>>;
export type DistinctApiResponse<T> = BaseFilteredApiResponse<DistinctApiResults<T>>;
export type ApiResponse<T> = FilteredApiResponse<T> | DistinctApiResponse<T>;
type ApiParamOp = "=" | "!=";
type ApiFilterKey = "distinct" | "limit" | "offset" | "search" | "sort";
export type ApiParams<T> = Array<[
    keyof T | ApiFilterKey,
    ApiParamOp,
    string | number | boolean
]>;
export type ApiPath = "/collections" | "/datasets";
export {};
