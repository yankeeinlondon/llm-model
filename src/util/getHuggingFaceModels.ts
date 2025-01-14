import type { HuggingFaceRepo } from "../api";
import { join } from "node:path";
import { MODEL_CACHE } from "../constants";
import { getFileBase, getModelsCache } from "./caching";
import { hasNetworkConnection } from "./hasNetworkConnection";
import { fetchWithAuth } from "./huggingFace";
import { isFileRecentlyModified } from "./isFileRecent";

/**
 * Returns a list of hugging face models.
 *
 * - by default returns all models
 * - can be reduced by passing in a filter as a "partial name"
 * - results are drawn from local cache until it is invalidated every two hours
 *
 * Note: also returns `fresh` and `network` boolean switches to provide client more
 * info about the source of the models.
 */
export async function getHuggingFaceModels(partialName: string): Promise<[repos: HuggingFaceRepo[], fresh: boolean, network: boolean]> {
  const cache = join(getFileBase(), MODEL_CACHE);
  const fresh = await isFileRecentlyModified(cache);
  const network = await hasNetworkConnection();
  const allModels = fresh || !network
    ? await getModelsCache()
    : await fetchWithAuth("/models") as HuggingFaceRepo[];

  const matchingModels = allModels.filter((model: any) =>
    model.modelId.toLowerCase().includes(partialName.toLowerCase()),
  );

  return [matchingModels, fresh, network];
}
