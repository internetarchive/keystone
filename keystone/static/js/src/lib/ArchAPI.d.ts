import { ApiParams, Collection, CollectionIdNamePairs, Dataset, FilteredApiResponse, User } from "./types";
export default class ArchAPI {
    static BasePath: string;
    static CSRF_REGEX: RegExp;
    static getCsrfHeader(): {
        "X-CSRFToken"?: string;
    };
    static jsonRequest<Item_T, Resp_T>(method: "GET" | "PUT" | "PATCH", path: string, params?: ApiParams<Item_T>, data?: Item_T): Promise<Resp_T>;
    static get collections(): {
        get: (params?: ApiParams<Collection>) => Promise<FilteredApiResponse<Collection>>;
    };
    static get datasets(): {
        get: (params?: ApiParams<Dataset>) => Promise<FilteredApiResponse<Dataset>>;
    };
    static get users(): {
        get: (userId: User["id"]) => Promise<User>;
        create: (user: Partial<User>, sendWelcomeEmail: boolean) => Promise<User>;
        update: (user: Partial<User>) => Promise<User>;
    };
    static allCollectionIdNamePairs(accountId: number): Promise<CollectionIdNamePairs>;
}
