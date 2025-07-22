import { BuildRequestAndFetchParameters, buildRequestAndFetch } from "../buildRequestAndFetch";

export type GetParameters = Omit<BuildRequestAndFetchParameters, "data">;

export async function get(getParameters: GetParameters) {
    return await buildRequestAndFetch(getParameters);
}
