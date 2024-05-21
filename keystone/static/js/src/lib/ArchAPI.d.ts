import { ApiParams, Collection, CollectionIdNamePairs, Dataset, FilteredApiResponse, JobId, JobParameters, PublishedDatasetInfo, PublishedDatasetMetadata, PublishedDatasetMetadataApiResponse, Team, TeamUpdate, User, UserUpdate } from "./types";
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
    static get jobs(): {
        run: (collectionId: Collection["id"], jobId: JobId, jobParameters: JobParameters) => Promise<Dataset>;
    };
    static get datasets(): {
        get: (params?: ApiParams<Dataset>) => Promise<FilteredApiResponse<Dataset>>;
        updateTeams: (datasetId: Dataset["id"], teams: Array<Team>) => Promise<null>;
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
        list: () => Promise<FilteredApiResponse<User>>;
        get: (userId: User["id"]) => Promise<User>;
        create: (user: Partial<User>, sendWelcomeEmail: boolean) => Promise<User>;
        update: (userId: User["id"], user: UserUpdate) => Promise<User>;
    };
    static get teams(): {
        list: () => Promise<FilteredApiResponse<Team>>;
        get: (teamId: Team["id"]) => Promise<Team>;
        create: (team: Partial<Team>) => Promise<Team>;
        update: (teamId: Team["id"], team: TeamUpdate) => Promise<Team>;
    };
    static allCollectionIdNamePairs(accountId: number): Promise<CollectionIdNamePairs>;
}
