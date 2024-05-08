import { identity } from "./helpers";
import {
  ApiParams,
  Collection,
  CollectionIdNamePairs,
  Dataset,
  FilteredApiResponse,
  JobId,
  JobParameters,
  JobState,
  ObjectApiResponse,
  PublishedDatasetInfo,
  PublishedDatasetInfoApiResponse,
  PublishedDatasetMetadata,
  PublishedDatasetMetadataApiResponse,
  ResponseError,
  RunJobRequest,
  Team,
  User,
  UserUpdate,
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
    method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT",
    path: string,
    params?: ApiParams<Item_T>,
    data?: Item_T,
    responseTranslator?: (response: unknown) => Resp_T
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
    if (method !== "GET") {
      headers = { ...headers, ...ArchAPI.getCsrfHeader() };
      if (data) {
        body = JSON.stringify(data);
      }
    }
    const res = await fetch(`${ArchAPI.BasePath}${path}${paramsStr}`, {
      method,
      headers,
      body,
    });
    // Throw a ResponseError on not-ok status.
    if (!res.ok) {
      throw new ResponseError(res);
    }
    // Return null for ACCEPTED and NO CONTENT responses.
    if (res.status === 202 || res.status === 204) {
      return null as Resp_T;
    }
    // Attempt to decode JSON body and apply any responseTranslator.
    return (responseTranslator || identity)(await res.json()) as Resp_T;
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

  static get jobs() {
    return {
      run: (
        collectionId: Collection["id"],
        jobId: JobId,
        jobParameters: JobParameters
      ) =>
        ArchAPI.jsonRequest<RunJobRequest, JobState>(
          "POST",
          "/datasets/generate",
          undefined,
          {
            collection_id: collectionId,
            job_type_id: jobId,
            params: jobParameters,
          }
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

      updateTeams: (datasetId: Dataset["id"], teams: Array<Team>) =>
        ArchAPI.jsonRequest<Array<Team>, null>(
          "POST",
          `/datasets/${datasetId}/teams`,
          undefined,
          teams
        ),

      publication: {
        info: (datasetId: Dataset["id"]) =>
          ArchAPI.jsonRequest<undefined, PublishedDatasetInfo>(
            "GET",
            `/datasets/${datasetId}/publication`,
            undefined,
            undefined,
            (response) => {
              const info = Object.assign({}, response) as PublishedDatasetInfo;
              info.time = new Date(
                (response as PublishedDatasetInfoApiResponse).time
              );
              return info;
            }
          ),

        metadata: {
          get: (datasetId: Dataset["id"]) =>
            ArchAPI.jsonRequest<undefined, PublishedDatasetMetadataApiResponse>(
              "GET",
              `/datasets/${datasetId}/publication/metadata`
            ),

          update: (
            datasetId: Dataset["id"],
            metadata: PublishedDatasetMetadata
          ) =>
            ArchAPI.jsonRequest<PublishedDatasetMetadata, null>(
              "POST",
              `/datasets/${datasetId}/publication/metadata`,
              undefined,
              metadata
            ),
        },

        unpublish: (datasetId: Dataset["id"]) =>
          ArchAPI.jsonRequest<undefined, null>(
            "DELETE",
            `/datasets/${datasetId}/publication`
          ),
      },
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
      update: (userId: User["id"], user: UserUpdate) =>
        ArchAPI.jsonRequest<UserUpdate, ObjectApiResponse<User>>(
          "PATCH",
          `/users/${userId}`,
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
