const GAME_SERVER_PORT = 8081;

export function getGameServerUrl(ipAddress: string): string {
    return `ws://${ipAddress}:${GAME_SERVER_PORT}`;
}
