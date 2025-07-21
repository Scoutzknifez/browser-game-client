import { HomePageContent } from "../../components/page-content/home-page-content/home-page-content";
import { getGameServerUrl } from "../../utils/getGameServerUrl";
import { getLocalIPv4Address } from "../../utils/getLocalIPv4Address";

export default function HomePage() {
    console.log("GET /");

    const gameServerIp = getLocalIPv4Address();
    const gameServerUrl = getGameServerUrl(gameServerIp);

    return <HomePageContent gameServerUrl={gameServerUrl} />;
}
