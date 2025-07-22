import os from "os";

export function getLocalIPv4Address(): string {
    const networkInterfaces = os.networkInterfaces();

    for (const name of Object.keys(networkInterfaces)) {
        for (const networkInterface of networkInterfaces[name] || []) {
            if (networkInterface.family === "IPv4" && !networkInterface.internal) {
                return networkInterface.address;
            }
        }
    }

    throw new Error("No local IPv4 detected!");
}
