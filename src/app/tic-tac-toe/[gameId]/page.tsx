import { HomePageContent } from "../../../components/page-content/tic-tac-toe-page-content/tic-tac-toe-page-content";
import { getGameServerUrl } from "../../../utils/urls/getGameServerUrl";
import { getLocalIPv4Address } from "../../../utils/urls/getLocalIPv4Address";

export type TicTacToeGamePageProps = {
    params: Promise<{
        gameId: string;
    }>;
};

export default async function TicTacToeGamePage(props: TicTacToeGamePageProps) {
    const params = await props.params;
    console.log(`GET /tic-tac-toe/${params.gameId}`);

    const gameServerIp = getLocalIPv4Address();
    const gameServerUrl = getGameServerUrl(gameServerIp);

    return <HomePageContent gameServerUrl={gameServerUrl} />;
}
