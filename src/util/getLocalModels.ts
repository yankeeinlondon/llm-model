import { log } from "node:console";
import { basename } from "node:path";
import chalk from "chalk";
import fg from "fast-glob";
import { filterUndefined, isDefined } from "inferred-types";
import { DEFAULT_MODEL_DIR } from "../constants";
import { chooseModel } from "../questions";
import { getHuggingFaceModels } from "./getHuggingFaceModels";
import { link, urlToModel } from "./link";

/**
 * Gets a list of all the local models. You may optionally filter
 * this down to the models _starting with_ a given string.
 *
 * **Related:** `localModelsWithUrl()`
 */
export async function getLocalModels(includes?: string) {
  const models = await fg.glob(`${DEFAULT_MODEL_DIR}/**/*.gguf`);
  if (includes) {
    return models.filter(
      i => basename(i.toLowerCase()).includes(includes.toLowerCase()),
    );
  }
  else {
    return models;
  }
}

export interface LocalModelWithUrl {
  /** the fully qualified filepath to the local model file */
  localFile: string;
  /** just the basename/local model file with no path */
  filename: string;
  /**
   * the URL to the HuggingFace repo that this file came from
   * (where available)
   */
  url: string | undefined;

  /**
   * a console _link_ to the Hugging Face model repo when available
   * otherwise just a plain text of the local model file.
   */
  link: string;
}

/**
 * Gets a list of all the local models along with the
 * HuggingFace URL to that model (if available). You may optionally filter
 * this down to the models _starting with_ a given string.
 *
 * **Related:** `localModels()`
 */
export async function getLocalModelsWithUrl(
  startingWith?: string,
  showFullPath: boolean = false,
): Promise<LocalModelWithUrl[]> {
  const localFiles = await getLocalModels(
    startingWith?.replace(".gguf", ""),
  );

  const results: LocalModelWithUrl[] = [];

  for (const localFile of localFiles) {
    const path = localFile.split("/").slice(0, -1).map(i => chalk.dim(i)).join("/");
    const filename = basename(localFile);
    const prettyPath = `${path}/${chalk.bold(filename)}`;
    const [meta] = await getHuggingFaceModels(
      filename.replace(".gguf", "").split("-").slice(0, -1).join("-"),
    );
    const repo = meta.length > 0
      ? meta[0].id
      : undefined;

    const abliterated = localFile.includes("abliterated")
      ? link("⚠", "https://github.com/Sumandora/remove-refusals-with-transformers")
      : "";

    const lmStudio = localFile.includes("lm-studio")
      ? chalk.bgBlue.blackBright(` lm-studio `)
      : "";

    results.push({
      localFile,
      filename,
      url: repo ? urlToModel(repo) : undefined,
      link: repo
        ? `${link(showFullPath ? prettyPath : filename, urlToModel(repo))} ${abliterated} ${lmStudio}`
        : `${showFullPath ? prettyPath : filename} ${abliterated} ${lmStudio}`,
    } as LocalModelWithUrl);
  }

  return results;
}

export async function getLocalModelsAsLinks(
  startingWith?: string,
  showFullPath: boolean = false,
) {
  const localModels = await getLocalModelsWithUrl(startingWith, showFullPath);

  return filterUndefined(
    ...localModels.map(m => `- ${m.link || m.filename}`),
  );
}

/**
 * Produces a set of "choices" for interactive **ask** prompts:
 *
 * - Keys are a string **link** for the console which provide the basename and a link to the
 * model repo
 * - Values are a fully qualified path to the local model file.
 */
export async function getLocalModelsAsChoices(startingWith?: string) {
  const localModels = await getLocalModelsWithUrl(startingWith);
  return localModels.reduce(
    (acc, model) => {
      const key = model.link;
      return {
        ...acc,
        [key]: model.localFile,
      };
    },
  );
}

/**
 * Ensures that a local model is chosen based on:
 *
 * - an initial `modelRef` being passed in
 * - if `modelRef` matches _one model_ locally then this is selected
 * - if _more_ than one is matched then user is asked to choose
 * - if no matches than all local models are offered as to choose
 * from
 *
 * Returns a fully qualified model name unless user choose to
 * "quit" in which case `false` is returned.
 */
export async function ensureLocalModelSelection(
  modelRef: string | undefined,
  _isDraft: boolean = false,
): Promise<string | false> {
  let model: string | false = false;

  if (isDefined(modelRef)) {
    const options = await getLocalModels(modelRef);
    if (options.length > 0) {
      const name = basename(options[0]);
      model = options[0];
      log(`- using ${chalk.bold.blue(name)} as LLM ${chalk.bold("model")}.`);
    }
    else {
      const choices = await getLocalModelsAsChoices(modelRef);
      if (Object.keys(choices).length > 0) {
        log(`- the model ${chalk.bold.blue(modelRef)} was not found locally!`);
        log(`- choose from the following models which resemble your choice:\n`);
        model = await chooseModel(modelRef);
      }
      else {
        log(`- the model ${chalk.bold.blue(modelRef)} was not found locally!`);
        model = await chooseModel();
      }
    }
  }
  else {
    log(`- no model specified, choose from the following:\n`);
    model = await chooseModel();
  }

  return model;
}
