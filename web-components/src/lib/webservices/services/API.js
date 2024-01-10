import { publish } from "../lib/pubsub.js";

const APPLICATION_JSON = "application/json";
const CSRF_REGEX = /csrftoken=([^;$]+)/;

const encodeSearchParams = (x) =>
  x ? `?${new URLSearchParams(x).toString()}` : "";

export default class API {
  /* Class to interact with a Django Rest Framework API.

     Available resources will be automatically discovered and made available
     as instance attributes, to be accessed as follows:

       api.{resourceName}.{methodName}

     For example:

       api.users.get(id, params)
   */

  constructor(basePath = "/api") {
    // Collect the request method names and function that we want to bind
    // to each resource.
    const nameMethodPairs = ["get", "patch", "post", "delete"].map((k) => [
      k,
      this[k].bind(this),
    ]);

    // Request the name -> url map of all available resource from the server.
    this.getJSON(basePath).then((resourceURLMap) => {
      // For each available resource, make each request method available as
      // a property of this API instance as:
      //   api.{resourceName}.{methodName}
      // For example:
      //   api.treenodes.get(id, params)
      Object.entries(resourceURLMap).forEach(
        ([resource, url]) =>
          (this[resource] = Object.fromEntries(
            nameMethodPairs.map(([name, func]) => [
              name,
              (...args) => func(url, ...args),
            ])
          ))
      );
      // Announce readiness.
      publish("API_SERVICE_READY");
    });
  }

  async getJSON(url) {
    /* Make a GET request for JSON data from the specified URL.
     */
    return await (
      await fetch(url, {
        credentials: "same-origin",
        headers: {
          accept: APPLICATION_JSON,
          ...getCsrfHeader(),
        },
      })
    ).json();
  }

  async get(resourceUrl, id, params) {
    /* Make a GET request with optional params.
     */
    return await this.getJSON(
      `${resourceUrl}${id ? `${id}` : ""}${encodeSearchParams(params)}`
    );
  }

  async patch(resourceUrl, id, data) {
    /* Make a PATCH request with the specified data.
     */
    return await fetch(`${resourceUrl}${id}/`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: {
        Accept: APPLICATION_JSON,
        "content-type": APPLICATION_JSON,
        ...getCsrfHeader(),
      },
      body: JSON.stringify(data),
    });
  }

  async post(resourceUrl, data) {
    /* Make a PUT request with the specified data.
     */
    return await fetch(resourceUrl, {
      credentials: "same-origin",
      method: "POST",
      headers: {
        Accept: APPLICATION_JSON,
        "content-type": APPLICATION_JSON,
        ...getCsrfHeader(),
      },
      body: JSON.stringify(data),
    });
  }

  async delete(resourceUrl, id) {
    /* Make a DELETE request.
     */
    return await fetch(`${resourceUrl}${id}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: {
        ...getCsrfHeader(),
      },
    });
  }

  async getResponseErrorDetail(response) {
    return response.status < 400
      ? null
      : {
          code: response.status,
          detail: (await response.json()).detail,
        };
  }
}

/**
 * Gets an object describing a CSRF header taking the value of the CSRF token
 * found in session cookie.
 */
export const getCsrfHeader = () => {
  const csrfMatch = CSRF_REGEX.exec(decodeURIComponent(document.cookie));
  if (!csrfMatch) {
    return {};
  }

  return { "X-CSRFToken": csrfMatch[1] };
};
