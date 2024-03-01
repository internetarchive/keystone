const CSRF_REGEX = /csrftoken=([^;$]+)/;

export const getCsrfHeader = (): { "X-CSRFToken"?: string } => {
  const csrfMatch = CSRF_REGEX.exec(decodeURIComponent(document.cookie));
  if (!csrfMatch) {
    return {};
  }

  return { "X-CSRFToken": csrfMatch[1] };
};

export function callJsonApi<Rq, Rsp>(options: {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  errorMessage: string;
  body?: Rq;
}): Promise<Rsp> {
  const request: RequestInit = {
    method: options.method,
    headers: {
      ...getCsrfHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (options.body) {
    request.body = JSON.stringify(options.body);
  }
  return (
    fetch(options.url, request)
      // cast response to generic response type
      .then((response) => {
        if (response.ok) {
          return response.json().then((r) => r as Rsp);
        } else {
          throw new Error(options.errorMessage);
        }
      })
      .catch((error) => {
        console.error(error);
        // log error, return no response
        return Promise.reject(options.errorMessage);
      })
  );
}
