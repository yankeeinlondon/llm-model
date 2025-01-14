import type { Iso8601DateTime } from "inferred-types";
import { log } from "node:console";
import chalk from "chalk";
import { saveModelsCache } from "../util";
import { getHuggingFaceModels } from "../util/getHuggingFaceModels";

export interface HuggingFaceRepo {
  _id: string;
  /** The model ID (e.g., "facebook/bart-large") */
  id: string;

  /** The commit hash of the model */
  sha: string;

  /** ISO string of the last modification timestamp */
  lastModified: string;

  /** Tags associated with the model (e.g., "transformers", "text-classification") */
  tags: string[];

  /** The main pipeline associated with the model (e.g., "text-generation") */
  pipeline_tag: string;

  /** Array of objects representing files in the model repository */
  siblings: {
    /** The file name in the repository */
    rfilename: string;
  }[];

  /** The author or organization name */
  author: string;

  /** Number of downloads */
  downloads: number;

  /** Number of likes */
  likes: number;
  trendingScore: number;

  createdAt: Iso8601DateTime;
  modelId: string;

  /** The library associated with the model (e.g., "transformers", "diffusers") */
  library_name: string;

  /** Indicates if the model is private */
  private: boolean;

  /** Model configuration (optional) */
  config?: Record<string, unknown>;
}

export async function findModelRepos(partialName: string): Promise<HuggingFaceRepo[]> {
  const [allModels, fresh, network] = await getHuggingFaceModels(partialName);

  if (fresh) {
    log(chalk.dim(`\n- models inventory ${chalk.italic("taken")} from cache (updated every 2 hours)`));
  }
  else if (!network) {
    log(chalk.dim(`\n- models inventory ${chalk.italic("taken")} from cache (no network connection)`));
  }
  else {
    await saveModelsCache(allModels);
    log(chalk.dim(`\n- models inventory ${chalk.italic.green("saved")} to the cache`));
  }

  const matchingModels = allModels.filter((model: any) =>
    model.modelId.toLowerCase().includes(partialName.toLowerCase()),
  );

  return matchingModels;
}
