import { Socket } from "node:net";

/**
 * checks whether a given port is in use by the system
 */
export async function isPortInUse(
  port: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const server = new Socket();

    server
      .once("error", (err) => {
        if ((err as any).code === "ECONNREFUSED")
          resolve(false); // Port is free
        else resolve(true); // Port is in use
      })
      .once("connect", () => {
        server.end();
        resolve(true); // Port is in use
      });

    server.connect(port, "127.0.0.1");
  });
}
