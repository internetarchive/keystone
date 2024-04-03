import {
  ApiParams,
  Collection,
  CollectionIdNamePairs,
  Dataset,
  FilteredApiResponse,
  ObjectApiResponse,
  ResponseError,
  User,
} from "./types";

export default class ArchAPI {
  static BasePath = "/api";

  static CSRF_REGEX = /csrftoken=([^;$]+)/;

  static getCsrfHeader(): { "X-CSRFToken"?: string } {
    /**
     * Gets an object describing a CSRF header taking the value of the CSRF token
     * found in session cookie.
     */
    const csrfMatch = ArchAPI.CSRF_REGEX.exec(
      decodeURIComponent(document.cookie)
    );
    if (!csrfMatch) {
      return {};
    }
    return { "X-CSRFToken": csrfMatch[1] };
  }

  static async jsonRequest<Item_T, Resp_T>(
    method: "GET" | "PUT" | "PATCH",
    path: string,
    params?: ApiParams<Item_T>,
    data?: Item_T
  ): Promise<Resp_T> {
    // Construct the search params string.
    const paramsStr = !params
      ? ""
      : "?" +
        new URLSearchParams(
          params.map(([k, op, v]) => [
            `${String(k)}${op === "!=" ? "!" : ""}`,
            String(v),
          ])
        ).toString();
    let headers = {
      accept: "application/json",
      "content-type": "application/json",
    };
    let body = null;
    if (method !== "GET" && data) {
      headers = { ...headers, ...ArchAPI.getCsrfHeader() };
      body = JSON.stringify(data);
    }
    const res = await fetch(`${ArchAPI.BasePath}${path}${paramsStr}`, {
      method,
      headers,
      body,
    });
    return new Promise((resolve, reject) =>
      !res.ok
        ? reject(new ResponseError(res))
        : void res
            .json()
            .then((data) => resolve(data as Resp_T))
            .catch(() => reject(new Error("could not decode response")))
    );
  }

  static get collections() {
    return {
      get: (params: ApiParams<Collection> = []) =>
        ArchAPI.jsonRequest<Collection, FilteredApiResponse<Collection>>(
          "GET",
          "/collections",
          params
        ),
    };
  }

  static get datasets() {
    return {
      get: (params: ApiParams<Dataset> = []) =>
        ArchAPI.jsonRequest<Dataset, FilteredApiResponse<Dataset>>(
          "GET",
          "/datasets",
          params
        ),
    };
  }

  static get users() {
    return {
      get: (userId: User["id"]) =>
        ArchAPI.jsonRequest<User, ObjectApiResponse<User>>(
          "GET",
          `/users/${userId}`
        ),
      create: (user: Partial<User>, sendWelcomeEmail: boolean) =>
        ArchAPI.jsonRequest<Partial<User>, ObjectApiResponse<User>>(
          "PUT",
          `/users?send_welcome=${JSON.stringify(sendWelcomeEmail)}`,
          undefined,
          user
        ),
      update: (user: Partial<User>) =>
        ArchAPI.jsonRequest<Partial<User>, ObjectApiResponse<User>>(
          "PATCH",
          `/users/${user.id as number}`,
          undefined,
          user
        ),
    };
  }

  static async allCollectionIdNamePairs(
    accountId: number
  ): Promise<CollectionIdNamePairs> {
    return (
      (
        await ArchAPI.jsonRequest<Collection, FilteredApiResponse<Collection>>(
          "GET",
          "/collections",
          [["account_id", "=", accountId]]
        )
      ).items as Array<Collection>
    ).map((c) => [c.id, c.name]) as CollectionIdNamePairs;
  }
}
