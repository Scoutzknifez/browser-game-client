const DOMAIN = "localhost:8080";

export type BuildRequestAndFetchParameters = {
    apiPathAndParameters: string;
    data?: object;
    host?: string;
    additionalFetchArguments?: object;
    onSuccess?: () => void;
    onFailure?: () => void;
};

export async function buildRequestAndFetch({
    apiPathAndParameters,
    data,
    host,
    additionalFetchArguments,
    onSuccess,
    onFailure,
}: BuildRequestAndFetchParameters) {
    const requestUrl = `${DOMAIN}${apiPathAndParameters}`;
    const request = createRequestWithData(host, data);

    let failed = false;
    let response: Response | undefined;

    try {
        response = await fetch(requestUrl, { ...request, ...additionalFetchArguments });
        if (!response.ok) {
            failed = true;
        }
    } catch {
        failed = true;
    }

    if (failed || !response) {
        if (onFailure) {
            onFailure();
        }

        let errorMessage = `HTTP Request (${request.method}) failed on: ${requestUrl}`;

        if (response) {
            const responseText = await response.text();
            errorMessage += `\nError Details From API: ${responseText}\n`;
        }

        throw new Error(errorMessage);
    }

    if (onSuccess) {
        onSuccess();
    }

    return response;
}

type Headers = { "Requesting-Host"?: string; Authorization?: string } | { "Content-Type": string };

type RequestInit = {
    method: string;
    headers?: Headers;
    body?: string;
};

function createRequestWithData(host: string | undefined, data?: object): RequestInit {
    if (data) {
        return {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
    }

    const request: RequestInit = {
        method: "GET",
        headers: {
            "Requesting-Host": host,
        },
    };

    return request;
}
