import { log } from "node:console";
import { exit } from "node:process";
import chalk from "chalk";
import { isDefined } from "inferred-types";
import { findVariantFiles } from "../api";
import { chooseModelFromLastSearch } from "../questions";
import { linkToModel, saveVariantsToFile } from "../util";

export async function variants(args: string[]) {
  let [modelName] = args;
  if (!modelName) {
    const action = await chooseModelFromLastSearch();
    if (action === "QUIT") {
      log("\nBye ...\n");
      exit();
    }

    modelName = action;
  }
  const { id, variants, gated } = await findVariantFiles(modelName);
  if (variants.length > 0) {
    const gatedInfo = isDefined(gated) && gated ? `, 🔐` : "";
    log(chalk.bold.green(`\nFile Variants [${chalk.dim(linkToModel(id))}${gatedInfo}]:\n`));
    let inGroup = false;
    for (const variant of variants) {
      if (inGroup && (variant.includes("1-of") || !variant.includes("-of"))) {
        log("");
        inGroup = false;
      }
      if (variant.includes("1-of")) {
        log("");
        inGroup = true;
      }
      if (variant.endsWith(".gguf")) {
        log(`- ${variant}`);
      }
      else {
        log(chalk.dim(`- ${variant}`));
      }
    }
    await saveVariantsToFile(variants);
  }
  else {
    log(chalk.bold.red(`\n- no variants found\n`));
  }
}
