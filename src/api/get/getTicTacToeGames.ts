import { get } from "./get";

export async function getTicTacToeGames(): Promise<SOME_TYPE[]> {
    const response = await get({ apiPathAndParameters: "/tic-tac-toe-games", additionalFetchArguments: { cache: "no-store" } });
    return await response.json();
}
