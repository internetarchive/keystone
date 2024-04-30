import { ApiParams, Collection, CollectionIdNamePairs, Dataset, FilteredApiResponse, PublishedDatasetInfo, PublishedDatasetMetadata, PublishedDatasetMetadataApiResponse, User, UserUpdate } from "./types";
export default class ArchAPI {
    static BasePath: string;
    static CSRF_REGEX: RegExp;
    static getCsrfHeader(): {
        "X-CSRFToken"?: string;
    };
    static jsonRequest<Item_T, Resp_T>(method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT", path: string, params?: ApiParams<Item_T>, data?: Item_T, responseTranslator?: (response: unknown) => Resp_T): Promise<Resp_T>;
    static get collections(): {
        get: (params?: ApiParams<Collection>) => Promise<FilteredApiResponse<Collection>>;
    };
    static get datasets(): {
        get: (params?: ApiParams<Dataset>) => Promise<FilteredApiResponse<Dataset>>;
        publication: {
            info: (datasetId: Dataset["id"]) => Promise<PublishedDatasetInfo>;
            metadata: {
                get: (datasetId: Dataset["id"]) => Promise<PublishedDatasetMetadataApiResponse>;
                update: (datasetId: Dataset["id"], metadata: PublishedDatasetMetadata) => Promise<null>;
            };
            unpublish: (datasetId: Dataset["id"]) => Promise<null>;
        };
    };
    static get users(): {
        get: (userId: User["id"]) => Promise<User>;
        create: (user: Partial<User>, sendWelcomeEmail: boolean) => Promise<User>;
        update: (userId: User["id"], user: UserUpdate) => Promise<User>;
    };
    static allCollectionIdNamePairs(accountId: number): Promise<CollectionIdNamePairs>;
}
