import { BuildRequestAndFetchParameters, buildRequestAndFetch } from "../buildRequestAndFetch";

export async function post(postParameters: BuildRequestAndFetchParameters) {
    return await buildRequestAndFetch(postParameters);
}
