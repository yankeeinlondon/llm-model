import { constants } from "node:fs";
import { access } from "node:fs/promises";

export async function waitForFile(
  filepath: string,
  timeout = 5000,
): Promise<boolean> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await access(filepath, constants.F_OK);
      return true;
    }
    catch {
      // File doesn't exist yet, wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return false;
}
