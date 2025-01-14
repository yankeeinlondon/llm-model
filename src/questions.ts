import { basename } from "node:path";
import { ask } from "@yankeeinlondon/ask";
import chalk from "chalk";
import { keysOf } from "inferred-types";
import { findVariantFiles, type HuggingFaceRepo } from "./api";
import { getLastModelSet, getLocalModels, showRepoModel } from "./util";

export const noModelSpecified = ask.select(
  "model",
  "No model was specified. Below are some common search choices. Choose one or quit and add what you want to the CLI.",
  [
    "bartowski",
    "TheBloke",
    "city96",
    "NexaAIDev",
    "meta-llama",
    "openai",
    "black-forest-labs",
    "Qwen",
    "deepseek",
    "NousResearch",
    "Mistral",
    "Embed",
    "StarCoder",
    "Falcon",
    "Microsoft",
    "Google",
    "QUIT",
  ],
);

function modelFiles(m: HuggingFaceRepo[]) {
  return keysOf(m).reduce(
    (acc, key) => ({
      ...acc,
      [showRepoModel(m[key], false)]: m[key].modelId,
    }),
    {},
  );
}

export async function chooseModelFromLastSearch() {
  const lastModelSet = await getLastModelSet();
  return ask.select(
    "model",
    `You didn't express the ${chalk("repo model")} on the command line.\n\nHere's a list of models from your last search (along with a QUIT option)\n`,
    {
      QUIT: "QUIT",
      ...modelFiles(lastModelSet),
    },
    {
      pageSize: 40,
    },
  )();
}

/**
 * Provides the list of _file variants_ from a given model.
 *
 * - secondary `collapse` variable is by default set to true and determines
 * whether file variants where more than one file represents the actual model
 * are _collapsed_ into one entry.
 */
export async function noVariantSpecified(
  m: string,
  _collapse: boolean = true,
): Promise<string> {
  const variants = await findVariantFiles(m);
  const v = variants.variants;

  return ask.select(
    "variant",
    `You didn't state the ${chalk("file variant")} for the model ${chalk.bold.blue(m)}.\n\nChoose for the available files below:`,
    [
      "QUIT",
      ...v,
    ],
    {
      pageSize: 40,
    },
  )();
}

export async function chooseModel(prefix?: string): Promise<string | false> {
  const models = await getLocalModels(prefix);
  const choices = models.reduce(
    (acc, model) => ({ [basename(model)]: model, ...acc }),
    { QUIT: false },
  ) as Record<string, string | false>;

  const answer = ask.select(
    "model",
    `Choose:`,
    choices,
  )() as unknown as Promise<string>;

  return answer;
}

/**
 * Ask user to choose 1:M local models
 */
export async function chooseMultipleModels(prefix?: string): Promise<string[]> {
  const models = await getLocalModels(prefix);
  const choices = models.reduce(
    (acc, model) => ({ [basename(model)]: model, ...acc }),
    { QUIT: false },
  ) as Record<string, string | false>;

  const answer = ask.checkbox(
    "model",
    `Choose one or more:`,
    choices,
  )() as unknown as Promise<string[]>;

  return answer;
}
