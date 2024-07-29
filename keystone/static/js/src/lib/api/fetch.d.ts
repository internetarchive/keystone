export declare const getCsrfHeader: () => {
    "X-CSRFToken"?: string;
};
export declare function callJsonApi<Rq, Rsp>(options: {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    errorMessage: string;
    body?: Rq;
}): Promise<Rsp>;
