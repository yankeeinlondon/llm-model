import { log } from "node:console";
import { exit } from "node:process";
import chalk from "chalk";
import { downloadModelFile } from "../api";
import { DEFAULT_MODEL_DIR } from "../constants";
import { chooseModelFromLastSearch, noVariantSpecified } from "../questions";

export async function download(args: string[]) {
  let [modelName, variant, outputDir = DEFAULT_MODEL_DIR] = args;
  if (!modelName) {
    modelName = await chooseModelFromLastSearch();
    if (modelName === "QUIT") {
      log("\nBye...\n");
      exit();
    }
  }
  if (!variant) {
    variant = await noVariantSpecified(modelName, true);
    if (variant === "QUIT") {
      log("\nBye...\n");
      exit();
    }
  }

  await downloadModelFile(modelName, variant, outputDir);
  log(`\n- 🚀 file downloaded to ${chalk.blue(outputDir)}\n`);
}
