import * as dns from "node:dns/promises";

export async function hasNetworkConnection(): Promise<boolean> {
  try {
    // Attempt to resolve a known domain (e.g., Google DNS)
    await dns.resolve("8.8.8.8");
    return true;
  }
  catch {
    return false;
  }
}
