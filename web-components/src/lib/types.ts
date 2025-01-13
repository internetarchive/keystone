import { JSONSchemaType } from "ajv";
import { SomeJSONSchema } from "ajv/lib/types/json-schema";

export { SomeJSONSchema };

import { ArchJobCard } from "../archGenerateDatasetForm/src/arch-job-card";

export type ValueOf<T> = T[keyof T];
export type Modify<T, R> = Omit<T, keyof R> & R;

export enum ProcessingState {
  SUBMITTED = "SUBMITTED",
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export type CollectionMetadataBase = {
  object_count?: number;
  object_name_singular?: string;
  object_name_plural?: string;
};

export type AITCollectionMetadata = CollectionMetadataBase & {
  is_public?: boolean;
  num_seeds?: number;
  last_crawl_date?: Date;
};

export type CustomCollectionMetadata = CollectionMetadataBase & {
  state: ProcessingState;
};

export type SpecialCollectionMetadata = CollectionMetadataBase & {
  input_spec?: Record<string, string>;
  type_displayname?: string;
};

export type CollectionMetadata =
  | AITCollectionMetadata
  | CustomCollectionMetadata
  | SpecialCollectionMetadata;

export enum CollectionType {
  AIT = "AIT",
  SPECIAL = "SPECIAL",
  CUSTOM = "CUSTOM",
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
  metadata: CollectionMetadata;
};

export type CollectionIdNamePairs = Array<
  [Collection["id"], Collection["name"]]
>;

export interface CollectionSearchResult {
  organizationId: number;
  organizationName: string;
  collectionName: string;
  collectionId: number;
  meta_Description?: string;
  totalWarcBytes: number;
  created_dt: string;
}

export interface CollectionAddToCartEventDetail {
  collectionSize: string;
  isSelected: boolean;
  collectionName: string;
  collectionId: string;
  organizationName: string;
  createdDt: string;
}

export interface CollectionSelectedDetail {
  collectionSize: string;
  collectionId: string;
  organizationName: string;
  createdDt: string;
}

export interface Facets {
  [key: string]: Array<string | number>;
}

export interface FacetResultMap {
  name: string;
  count: number;
}

export interface SelectedFacets {
  f_organizationName: string[];
  f_organizationType: string[];
}

export interface SolrData {
  collections: CollectionSearchResult[];
  facets: Facets;
}

export interface CollectionRemovedFromCartDetail {
  collectionName: string;
}

export type Dataset = {
  category_name: string;
  collection_access: boolean;
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

export type JobIdStatesMap = Record<
  Dataset["job_id"],
  Array<[Dataset["id"], DatasetStartTimeString, Dataset["state"]]>
>;

export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
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
  teams: Array<MinimalTeam>;
};

export type MinimalUser = Pick<User, "id" | "username">;

export type UserUpdate = Pick<
  User,
  "first_name" | "last_name" | "email" | "role" | "teams"
>;

export type Team = {
  account_id: number;
  id: number;
  name: string;
  members: Array<MinimalUser>;
};

export type MinimalTeam = Pick<Team, "id" | "name">;

export type TeamUpdate = {
  name?: string;
  members?: Array<MinimalUser>;
};

// AvailableJob parameters types

type GlobalJobParameters = {
  sample: boolean;
};

type NamedEntityExtractionParameters = GlobalJobParameters & {
  language: string;
};

export type JobParameters = NamedEntityExtractionParameters;
export type JobParametersKey = keyof JobParameters;
export type JobParametersValue = JobParameters[JobParametersKey];

// Datasets objects are also used to convey job state.
export type JobState = Dataset;

// JobId is a UUID7 string.
export type JobId = string;

export type AvailableJob = {
  id: JobId;
  name: string;
  description: string;
  info_url: string;
  code_url: string;
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

export type PublishedDatasetInfoApiResponse = {
  item: string;
  source: string;
  collection: string;
  job: JobId;
  complete: boolean;
  sample: boolean;
  time: string;
  ark: string;
};

export type PublishedDatasetInfo = Modify<
  PublishedDatasetInfoApiResponse,
  {
    time: Date;
  }
>;

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

export type PublishedDatasetMetadataValue =
  PublishedDatasetMetadata[PublishedDatasetMetadataKey];

export type PublishedDatasetMetadataJSONSchema =
  JSONSchemaType<PublishedDatasetMetadata>;

export type PublishedDatasetMetadataJSONSchemaProps = Record<
  keyof PublishedDatasetMetadata,
  SomeJSONSchema
>;

// API Types

export type BaseFilteredApiResponse<T> = {
  count: number;
  items: T;
};

type FilteredApiResults<T> = Array<T>;

type DistinctApiResults<T> = Array<T[keyof T]>;

export type FilteredApiResponse<T> = BaseFilteredApiResponse<
  FilteredApiResults<T>
>;

export type DistinctApiResponse<T> = BaseFilteredApiResponse<
  DistinctApiResults<T>
>;

export type ObjectApiResponse<T> = T;

export type ApiResponse<T> =
  | FilteredApiResponse<T>
  | DistinctApiResponse<T>
  | ObjectApiResponse<T>;

export class ResponseError extends Error {
  constructor(public response: Response, msg?: string) {
    super(msg);
  }
}

type ApiParamOp = "=" | "!=";

type ApiFilterKey = "distinct" | "limit" | "offset" | "search" | "sort";

export type ApiParams<T> = Array<
  [keyof T | ApiFilterKey, ApiParamOp, string | number | boolean]
>;

// Custom Events

export type GenerateDatasetDetail = {
  archJobCard: ArchJobCard;
};

export type GlobalModalDetail = {
  elementToFocusOnClose: HTMLElement;
  title: string;
  content: string | HTMLElement;
};

export type RunJobRequest = {
  collection_id: Collection["id"];
  job_type_id: JobId;
  params: JobParameters;
};
