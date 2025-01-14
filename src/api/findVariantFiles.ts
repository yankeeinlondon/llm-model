import { fetchWithAuth, modelFileExtensions } from "../util";

interface HuggingFaceModelDetails {
  /** The model ID (e.g., "facebook/bart-large") */
  id: string;
  /** The Git commit hash for the current state of the repository */
  sha: string;
  /** ISO string of the last modification timestamp */
  lastModified: string;
  /** The name of the author or organization that owns the model */
  author: string;
  /** The library used for the model (e.g., "transformers", "diffusers") */
  library: string;
  /** The primary pipeline associated with the model (e.g., "text-generation") */
  pipelineTag: string;
  /** List of all files in the repository */
  siblings: {
    /** Relative file name in the repository */
    rfilename: string;
    /** The size of the file in bytes */
    size: number;
    /** Git LFS pointer if the file is stored via Git LFS (optional) */
    lfs?: {
      /** SHA256 hash of the file */
      sha256: string;
      /** Size of the file in bytes */
      size: number;
    };
  }[];
  /** Indicates whether the model is private */
  private: boolean;
  /** Total downloads for the model */
  downloads: number;
  /** Total number of likes or stars for the model */
  likes: number;
  /** Indicates if the model is gated (requires acceptance of conditions to use) */
  gated: boolean;
  /** Configuration metadata for the model */
  config?: Record<string, unknown>;
  /** List of tags associated with the model */
  tags: string[];
  /** Optional additional metadata */
  cardData?: Record<string, unknown>;
}

interface ModelVariants {
  id: string;
  variants: string[];
  likes: number;
  gated: boolean;
}

/**
 * List all file variants of a given HuggingFace model
 */
export async function findVariantFiles(modelName: string): Promise<ModelVariants> {
  const modelData = (await fetchWithAuth(`/models/${modelName}`)) as HuggingFaceModelDetails;
  if (!modelData.siblings || modelData.siblings.length === 0) {
    throw new Error(`No files found for model: ${modelName}`);
  }

  return {
    id: modelData.id,
    likes: modelData.likes,
    gated: modelData.gated,
    variants: modelData.siblings.map((file: { rfilename: string }) => file.rfilename).filter(modelFileExtensions),
  };
}
