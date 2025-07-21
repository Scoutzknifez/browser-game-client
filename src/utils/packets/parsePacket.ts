import { BasePacket } from "browser-game-shared";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePacket<T extends BasePacket>(data: any): T {
    const packetAsString = data.toString();
    const packetAsJson = JSON.parse(packetAsString);
    return packetAsJson;
}
