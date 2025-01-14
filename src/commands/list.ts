import type { CliSwitches } from "../types";
import { log } from "node:console";
import chalk from "chalk";
import { getLocalModelsAsLinks } from "../util/getLocalModels";

export async function list(args: string[], switches: CliSwitches) {
  const verbose = switches.boolean.includes("-v");
  const names = await getLocalModelsAsLinks(args[0], verbose);

  log(chalk.bold.green(`\nDownloaded Models\n`));
  log(names.join("\n"));
}
