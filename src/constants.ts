import process from "node:process";
import { isBooleanLike, isNumberLike } from "inferred-types";
import "dotenv/config";

export const HUGGINGFACE_API_URL = "https://huggingface.co/api";
export const AUTH_TOKEN = process.env.HUGGINGFACE_AUTH_TOKEN;
export const HOME_DIR = process.env.HOME;
export const CONFIG_BASE_DIR = `${HOME_DIR}/.config` as const;
export const CONFIG_DIR = `${CONFIG_BASE_DIR}/llm-model` as const;
export const MODEL_CACHE = ".models.json" as const;
export const LAST_MODEL_SET = ".last-model-result.json" as const;
export const VARIANT_CACHE = ".model-variant.json" as const;
export const BENCH_CACHE = ".bench.json" as const;
export const JOBS_CACHE = ".jobs.json" as const;
export const DEFAULT_MODEL_DIR = process.env.HF_HOME || process.env.PWD || ".";

// LLAMA PARAMs

/** number of layers to the GPU */
export const NGL = isNumberLike(process.env.NGL) ? Number(process.env.NGL) : 99;
/** number of layers to the GPU (for the draft model) */
export const NGLD = isNumberLike(process.env.NGLD) ? Number(process.env.NGLD) : 99;
/** context size for the LLM model  */
export const CONTEXT_SIZE = isNumberLike(process.env.CONTEXT_SIZE)
  ? Number(process.env.CONTEXT_SIZE)
  : 16384;

/** context size for the LLM _draft_ model  */
export const CONTEXT_SIZE_DRAFT = isNumberLike(process.env.CONTEXT_SIZE_DRAFT)
  ? Number(process.env.CONTEXT_SIZE_DRAFT)
  : 16384;

export const TEMP = isNumberLike(process.env.TEMP)
  ? Number(process.env.TEMP)
  : 0.6;

export const HOST = process.env.HOST || "0.0.0.0";
export const PORT = isNumberLike(process.env.PORT)
  ? Number(process.env.PORT)
  : 8087;

/** the maximum number of draft tokens to generate (default: 16) */
export const DRAFT_MAX = isNumberLike(process.env.DRAFT_MAX)
  ? Number(process.env.DRAFT_MAX)
  : 16;

/** the minimum number of draft tokens to generate (default: 1) */
export const DRAFT_MIN = isNumberLike(process.env.DRAFT_MIN)
  ? Number(process.env.DRAFT_MIN)
  : 1;

/** the minimum probability threshold for draft tokens (default: 0.05) */
export const DRAFT_P_MIN = isNumberLike(process.env.DRAFT_P_MIN)
  ? Number(process.env.DRAFT_P_MIN)
  : 1;

/** enable Flash Attention (default: false) */
export const FLASH_ATTN = isBooleanLike(process.env.FLASH_ATTN)
  ? Boolean(process.env.FLASH_ATTN)
  : false;

export const LLAMA_CPP_BOOLEAN = [
  ["--help", "-h", "Print usage and exit."],
  ["--usage", "-h", "Print usage and exit."],
  ["--version", "", "Show version and build info."],
  ["--verbose-prompt", "", "Print a verbose prompt before generation (default: false)."],
  ["--cpu-strict", "", "Use strict CPU placement (default: 0)."],
  ["--poll-batch", "", "Use polling to wait for work (default: same as --poll)."],
  ["--flash-attn", "-fa", "Enable Flash Attention (default: disabled)."],
  ["--no-perf", "", "Disable internal libllama performance timings (default: false)."],
  ["--escape", "-e", "Process escape sequences (\\n, \\r, \\t, ', \", \\) (default: true)."],
  ["--no-escape", "", "Do not process escape sequences."],
  ["--dump-kv-cache", "-dkvc", "Verbose print of the KV cache."],
  ["--no-kv-offload", "-nkvo", "Disable KV offload."],
  ["--mlock", "", "Force system to keep model in RAM rather than swapping or compressing."],
  ["--no-mmap", "", "Do not memory-map model (slower load but may reduce pageouts if not using mlock)."],
  ["--list-devices", "", "Print list of available devices and exit."],
  ["--check-tensors", "", "Check model tensor data for invalid values (default: false)."],
  ["--log-disable", "", "Disable logging."],
  ["--log-colors", "", "Enable colored logging."],
  ["--verbose", "-v", "Set verbosity level to infinity (i.e., log all messages, useful for debugging)."],
  ["--log-verbose", "-v", "Set verbosity level to infinity (i.e., log all messages, useful for debugging)."],
  ["--log-prefix", "", "Enable prefix in log messages."],
  ["--log-timestamps", "", "Enable timestamps in log messages."],
  ["--ignore-eos", "", "Ignore end of stream token and continue generating (implies --logit-bias EOS-inf)."],
  ["--no-context-shift", "", "Disables context shift on infinite text generation (default: disabled)."],
  ["--special", "-sp", "Special tokens output enabled (default: false)."],
  ["--no-warmup", "", "Skip warming up the model with an empty run."],
  ["--spm-infill", "", "Use Suffix/Prefix/Middle pattern for infill (instead of Prefix/Suffix/Middle) as some models prefer this (default: disabled)."],
  ["--cont-batching", "-cb", "Enable continuous batching (a.k.a dynamic batching) (default: enabled)."],
  ["--no-cont-batching", "-nocb", "Disable continuous batching."],
  ["--no-webui", "", "Disable the Web UI (default: enabled)."],
  ["--embedding", "", "Restrict to only support embedding use case; use only with dedicated embedding models (default: disabled)."],
  ["--embeddings", "", "Restrict to only support embedding use case; use only with dedicated embedding models (default: disabled)."],
  ["--reranking", "", "Enable reranking endpoint on server (default: disabled)."],
  ["--rerank", "", "Enable reranking endpoint on server (default: disabled)."],
  ["--metrics", "", "Enable Prometheus-compatible metrics endpoint (default: disabled)."],
  ["--slots", "", "Enable slots monitoring endpoint (default: disabled)."],
  ["--props", "", "Enable changing global properties via POST /props (default: disabled)."],
  ["--no-slots", "", "Disables slots monitoring endpoint."],
  ["--lora-init-without-apply", "", "Load LoRA adapters without applying them (apply later via POST /lora-adapters) (default: disabled)."],
] as const;

export const LLAMA_CPP_STRING = [
  ["--cpu-mask", "-C", "CPU affinity mask: arbitrarily long hex. Complements cpu-range (default: \"\")."],
  ["--cpu-range", "-Cr", "Range of CPUs for affinity. Complements --cpu-mask."],
  ["--cpu-mask-batch", "-Cb", "CPU affinity mask: arbitrarily long hex. Complements cpu-range-batch (default: same as --cpu-mask)."],
  ["--cpu-range-batch", "-Crb", "Ranges of CPUs for affinity. Complements --cpu-mask-batch."],
  ["--rope-scaling", "", "RoPE frequency scaling method, defaults to linear unless specified by the model."],
  ["--cache-type-k", "-ctk", "KV cache data type for K (allowed values: f32, f16, bf16, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1, default: f16)."],
  ["--cache-type-v", "-ctv", "KV cache data type for V (allowed values: f32, f16, bf16, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1, default: f16)."],
  ["--numa", "", "Attempt optimizations that help on some NUMA systems."],
  ["--device", "-dev", "Comma-separated list of devices to use for offloading (none = don't offload)."],
  ["--split-mode", "-sm", "How to split the model across multiple GPUs (none, layer, row, default: layer)."],
  ["--tensor-split", "-ts", "Fraction of the model to offload to each GPU, comma-separated list of proportions."],
  ["--override-kv", "", "Advanced option to override model metadata by key. May be specified multiple times."],
  ["--lora", "", "Path to LoRA adapter (can be repeated to use multiple adapters)."],
  ["--lora-scaled", "", "Path to LoRA adapter with user-defined scaling (can be repeated to use multiple adapters)."],
  ["--control-vector", "", "Add a control vector. Can be repeated to add multiple control vectors."],
  ["--control-vector-scaled", "", "Add a control vector with user-defined scaling. Can be repeated to add multiple scaled control vectors."],
  ["--control-vector-layer-range", "", "Layer range to apply the control vector(s) to, start and end inclusive."],
  ["--model", "-m", "Model path (default: models/$filename with filename from --hf-file or --model-url if set, otherwise models/7B/ggml-model-f16.gguf)."],
  ["--model-url", "-mu", "Model download URL (default: unused)."],
  ["--hf-repo", "-hfr", "Hugging Face model repository (default: unused)."],
  ["--hf-file", "-hff", "Hugging Face model file (default: unused)."],
  ["--hf-token", "-hft", "Hugging Face access token (default: value from HF_TOKEN environment variable)."],
  ["--log-file", "", "Log to file."],
  ["--samplers", "", "Samplers that will be used for generation in the order, separated by ';'."],
  ["--sampling-seq", "", "Simplified sequence for samplers that will be used (default: dkypmxt)."],
  ["--dry-sequence-breaker", "", "Add sequence breaker for DRY sampling, clearing out default breakers ('\\n', ':', '\"', '*') in the process; use \"none\" to not use any sequence breakers."],
  ["--logit-bias", "-l", "Modifies the likelihood of token appearing in the completion."],
  ["--grammar", "", "BNF-like grammar to constrain generations (default: '')."],
  ["--grammar-file", "", "File to read grammar from."],
  ["--json-schema", "-j", "JSON schema to constrain generations."],
  ["--pooling", "", "Pooling type for embeddings, use model default if unspecified."],
  ["--alias", "-a", "Set alias for model name (to be used by REST API)."],
  ["--host", "", "IP address to listen (default: 127.0.0.1)."],
  ["--path", "", "Path to serve static files from (default: )."],
  ["--api-key", "", "API key to use for authentication (default: none)."],
  ["--api-key-file", "", "Path to file containing API keys (default: none)."],
  ["--ssl-key-file", "", "Path to file a PEM-encoded SSL private key."],
  ["--ssl-cert-file", "", "Path to file a PEM-encoded SSL certificate."],
  ["--slot-save-path", "", "Path to save slot KV cache (default: disabled)."],
  ["--chat-template", "", "Set custom Jinja chat template (default: template taken from model's metadata)."],
  ["--device-draft", "-devd", "Comma-separated list of devices to use for offloading the draft model (none = don't offload)."],
  ["--model-draft", "-md", "Draft model for speculative decoding (default: unused)."],
] as const;

export const LLAMA_CPP_NUMBER = [
  ["--threads", "-t", "Number of threads to use during generation (default: -1)."],
  ["--threads-batch", "-tb", "Number of threads to use during batch and prompt processing (default: same as --threads)."],
  ["--prio", "", "Set process/thread priority: 0-normal, 1-medium, 2-high, 3-realtime (default: 0)."],
  ["--poll", "", "Use polling level to wait for work (0 - no polling, default: 50)."],
  ["--prio-batch", "", "Set process/thread priority: 0-normal, 1-medium, 2-high, 3-realtime (default: 0)."],
  ["--ctx-size", "-c", "Size of the prompt context (default: 4096, 0 = loaded from model)."],
  ["--predict", "-n", "Number of tokens to predict (default: -1, -1 = infinity, -2 = until context filled)."],
  ["--n-predict", "-n", "Number of tokens to predict (default: -1, -1 = infinity, -2 = until context filled)."],
  ["--batch-size", "-b", "Logical maximum batch size (default: 2048)."],
  ["--ubatch-size", "-ub", "Physical maximum batch size (default: 512)."],
  ["--keep", "", "Number of tokens to keep from the initial prompt (default: 0, -1 = all)."],
  ["--rope-scale", "", "RoPE context scaling factor, expands context by a factor of N."],
  ["--rope-freq-base", "", "RoPE base frequency, used by NTK-aware scaling (default: loaded from model)."],
  ["--rope-freq-scale", "", "RoPE frequency scaling factor, expands context by a factor of 1/N."],
  ["--yarn-orig-ctx", "", "YaRN: original context size of model (default: 0 = model training context size)."],
  ["--yarn-ext-factor", "", "YaRN: extrapolation mix factor (default: -1.0, 0.0 = full interpolation)."],
  ["--yarn-attn-factor", "", "YaRN: scale sqrt(t) or attention magnitude (default: 1.0)."],
  ["--yarn-beta-slow", "", "YaRN: high correction dim or alpha (default: 1.0)."],
  ["--yarn-beta-fast", "", "YaRN: low correction dim or beta (default: 32.0)."],
  ["--defrag-thold", "-dt", "KV cache defragmentation threshold (default: 0.1, < 0 - disabled)."],
  ["--parallel", "-np", "Number of parallel sequences to decode (default: 1)."],
  ["--gpu-layers", "-ngl", "Number of layers to store in VRAM."],
  ["--n-gpu-layers", "-ngl", "Number of layers to store in VRAM."],
  ["--main-gpu", "-mg", "The GPU to use for the model (with split-mode = none), or for intermediate results and KV (with split-mode = row) (default: 0)."],
  ["--verbosity", "-lv", "Set the verbosity threshold. Messages with a higher verbosity will be ignored."],
  ["--log-verbosity", "-lv", "Set the verbosity threshold. Messages with a higher verbosity will be ignored."],
  ["--seed", "-s", "RNG seed (default: -1, use random seed for -1)."],
  ["--temp", "", "Temperature (default: 0.8)."],
  ["--top-k", "", "Top-k sampling (default: 40, 0 = disabled)."],
  ["--top-p", "", "Top-p sampling (default: 0.9, 1.0 = disabled)."],
  ["--min-p", "", "Min-p sampling (default: 0.1, 0.0 = disabled)."],
  ["--xtc-probability", "", "XTC probability (default: 0.0, 0.0 = disabled)."],
  ["--xtc-threshold", "", "XTC threshold (default: 0.1, 1.0 = disabled)."],
  ["--typical", "", "Locally typical sampling, parameter p (default: 1.0, 1.0 = disabled)."],
  ["--repeat-last-n", "", "Last n tokens to consider for penalize (default: 64, 0 = disabled, -1 = ctx_size)."],
  ["--repeat-penalty", "", "Penalize repeat sequence of tokens (default: 1.0, 1.0 = disabled)."],
  ["--presence-penalty", "", "Repeat alpha presence penalty (default: 0.0, 0.0 = disabled)."],
  ["--frequency-penalty", "", "Repeat alpha frequency penalty (default: 0.0, 0.0 = disabled)."],
  ["--dry-multiplier", "", "Set DRY sampling multiplier (default: 0.0, 0.0 = disabled)."],
  ["--dry-base", "", "Set DRY sampling base value (default: 1.75)."],
  ["--dry-allowed-length", "", "Set allowed length for DRY sampling (default: 2)."],
  ["--dry-penalty-last-n", "", "Set DRY penalty for the last n tokens (default: -1, 0 = disable, -1 = context size)."],
  ["--dynatemp-range", "", "Dynamic temperature range (default: 0.0, 0.0 = disabled)."],
  ["--dynatemp-exp", "", "Dynamic temperature exponent (default: 1.0)."],
  ["--mirostat", "", "Use Mirostat sampling (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0)."],
  ["--mirostat-lr", "", "Mirostat learning rate, parameter eta (default: 0.1)."],
  ["--mirostat-ent", "", "Mirostat target entropy, parameter tau (default: 5.0)."],
  ["--port", "", "Port to listen (default: 8080)."],
  ["--timeout", "-to", "Server read/write timeout in seconds (default: 600)."],
  ["--threads-http", "", "Number of threads used to process HTTP requests (default: -1)."],
  ["--cache-reuse", "", "Min chunk size to attempt reusing from the cache via KV shifting (default: 0)."],
  ["--slot-prompt-similarity", "-sps", "How much the prompt of a request must match the prompt of a slot in order to use that slot (default: 0.50, 0.0 = disabled)."],
  ["--draft-max", "", "Number of tokens to draft for speculative decoding (default: 16)."],
  ["--draft", "", "Number of tokens to draft for speculative decoding (default: 16)."],
  ["--draft-n", "", "Number of tokens to draft for speculative decoding (default: 16)."],
  ["--draft-min", "", "Minimum number of draft tokens to use for speculative decoding (default: 5)."],
  ["--draft-n-min", "", "Minimum number of draft tokens to use for speculative decoding (default: 5)."],
  ["--draft-p-min", "", "Minimum speculative decoding probability (greedy) (default: 0.9)."],
  ["--ctx-size-draft", "-cd", "Size of the prompt context for the draft model (default: 0, 0 = loaded from model)."],
  ["--gpu-layers-draft", "-ngld", "Number of layers to store in VRAM for the draft model."],
  ["--n-gpu-layers-draft", "-ngld", "Number of layers to store in VRAM for the draft model."],
] as const;
