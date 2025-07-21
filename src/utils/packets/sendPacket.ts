import { BasePacket } from "browser-game-shared";

export function sendPacket<T extends BasePacket>(webSocket: WebSocket, packet: T) {
    const packetAsString = JSON.stringify(packet);
    webSocket.send(packetAsString);
}
