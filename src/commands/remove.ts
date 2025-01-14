import type { CliSwitches } from "../types";
import { log } from "node:console";
import { exit } from "node:process";
import { ask } from "@yankeeinlondon/ask";
import chalk from "chalk";
import { chooseMultipleModels } from "../questions";
import { bye, getLocalModels } from "../util";

export async function remove(args: string[], _switches: CliSwitches) {
  const models = [];
  for (const a of args) {
    const m = await getLocalModels(a);
    models.push(...m);
  }

  if (models.length === 0) {
    log(`- choose models to remove:\n`);
    const m = await chooseMultipleModels();
    if (m.length === 0) {
      bye();
      exit();
    }
    models.push(...m);
  }
  else {
    log(models.map(i => `- ${i}`).join("\n"));
    const c = await ask.confirm("cont", "\nRemove these models?")();
    if (!c) {
      bye();
      exit();
    }
  }

  log(`- removing ${models.length} local models`);
  for (const model of models) {
    const file = Bun.file(model);
    if (await file.exists()) {
      await file.delete();
      log(`- removed ${chalk.blue(model)}`);
    }
  }
}
