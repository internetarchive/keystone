import { JSONSchemaType } from "ajv";
import { SomeJSONSchema } from "ajv/lib/types/json-schema";
export { SomeJSONSchema };
import { ArchJobCard } from "../archGenerateDatasetForm/src/arch-job-card";
export type ValueOf<T> = T[keyof T];
export declare enum ProcessingState {
    SUBMITTED = "SUBMITTED",
    QUEUED = "QUEUED",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export type AITCollectionMetadata = {
    is_public?: boolean;
    num_seeds?: number;
    last_crawl_date?: Date;
};
export type CustomCollectionMetadata = {
    state: ProcessingState;
};
export declare enum CollectionType {
    AIT = "AIT",
    SPECIAL = "SPECIAL",
    CUSTOM = "CUSTOM"
}
export type Collection = {
    account_id: number;
    id: number;
    name: string;
    collection_type: CollectionType;
    size_bytes: number;
    dataset_count: number;
    latest_dataset: {
        id: number;
        name: string;
        start_time: Date;
    };
    metadata: AITCollectionMetadata | CustomCollectionMetadata;
};
export type CollectionIdNamePairs = Array<[
    Collection["id"],
    Collection["name"]
]>;
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
export interface CollectionRemovedFromCartDetail {
    collectionName: string;
}
export type Dataset = {
    category_name: string;
    collection_id: number;
    collection_name: string;
    finished_time: Date;
    id: number;
    is_sample: boolean;
    job_id: string;
    name: string;
    start_time: Date;
    state: ProcessingState;
};
type DatasetStartTimeString = string;
export type JobIdStatesMap = Record<Dataset["job_id"], Array<[Dataset["id"], DatasetStartTimeString, Dataset["state"]]>>;
export declare enum UserRoles {
    ADMIN = "ADMIN",
    USER = "USER"
}
export type User = {
    id: number;
    account_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRoles;
    date_joined: Date;
    last_login: Date;
};
type GlobalJobParameters = {
    sample: boolean;
};
type NamedEntityExtractionParameters = GlobalJobParameters & {
    language: string;
};
export type JobParameters = NamedEntityExtractionParameters;
export type JobParametersKey = keyof JobParameters;
export type JobParametersValue = JobParameters[JobParametersKey];
export type JobState = Dataset;
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
export type AvailableJob = {
    id: JobId;
    name: string;
    description: string;
    parameters_schema: JSONSchemaType<JobParameters>;
};
export type AvailableJobsCategory = {
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
    categoryId: string;
    jobs: Array<AvailableJob>;
};
export type AvailableJobs = Array<AvailableJobsCategory>;
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
export type PublishedDatasetMetadataKey = keyof PublishedDatasetMetadata;
export type PublishedDatasetMetadataValue = PublishedDatasetMetadata[PublishedDatasetMetadataKey];
export type PublishedDatasetMetadataJSONSchema = JSONSchemaType<PublishedDatasetMetadata>;
export type PublishedDatasetMetadataJSONSchemaProps = Record<keyof PublishedDatasetMetadata, SomeJSONSchema>;
export type BaseFilteredApiResponse<T> = {
    count: number;
    items: T;
};
type FilteredApiResults<T> = Array<T>;
type DistinctApiResults<T> = Array<T[keyof T]>;
export type FilteredApiResponse<T> = BaseFilteredApiResponse<FilteredApiResults<T>>;
export type DistinctApiResponse<T> = BaseFilteredApiResponse<DistinctApiResults<T>>;
export type ObjectApiResponse<T> = T;
export type ApiResponse<T> = FilteredApiResponse<T> | DistinctApiResponse<T> | ObjectApiResponse<T>;
export declare class ResponseError extends Error {
    response: Response;
    constructor(response: Response, msg?: string);
}
type ApiParamOp = "=" | "!=";
type ApiFilterKey = "distinct" | "limit" | "offset" | "search" | "sort";
export type ApiParams<T> = Array<[
    keyof T | ApiFilterKey,
    ApiParamOp,
    string | number | boolean
]>;
export type GenerateDatasetDetail = {
    archJobCard: ArchJobCard;
};
export type GlobalModalDetail = {
    elementToFocusOnClose: HTMLElement;
    title: string;
    message: string;
};
