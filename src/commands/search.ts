import { log } from "node:console";
import { exit } from "node:process";
import chalk from "chalk";
import { findModelRepos } from "../api";
import { noModelSpecified } from "../questions";
import { saveLastModelSet, showRepoModel } from "../util";

export async function search(args: string[]) {
  let [partialName] = args;
  if (!partialName) {
    partialName = await noModelSpecified();
    if (partialName === "QUIT") {
      log("\n- Bye!\n");
      exit();
    }
  };
  const models = await findModelRepos(partialName);
  log(chalk.bold.green("\nMatching models:"));
  log("");
  for (const model of models) {
    log(showRepoModel(model));
  }

  await saveLastModelSet(models);
}
