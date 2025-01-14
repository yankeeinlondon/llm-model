import type { Iso8601DateTime } from "inferred-types";

export interface Bench {
  /** A string representing the commit hash. */
  build_commit: string;
  /** A number representing the build number. */
  build_number: number;
  /** A string describing the CPU information. */
  cpu_info: string;
  /** A string describing the GPU information. */
  gpu_info: string;
  /** A string listing the backends used. */
  backends: string;
  /** A string representing the path to the model file. */
  model_filename: string;
  /** A string describing the type of the model. */
  model_type: string;
  /** A number representing the size of the model in bytes. */
  model_size: number;
  /** A number representing the number of parameters in the model. */
  model_n_params: number;
  /** A number representing the batch size. */
  n_batch: number;
  /** A number representing the micro-batch size. */
  n_ubatch: number;
  /** A number representing the number of threads. */
  n_threads: number;
  /** A string representing the CPU mask. */
  cpu_mask: string;
  /** A boolean indicating whether CPU strict mode is enabled. */
  cpu_strict: boolean;
  /** A number representing the polling interval. */
  poll: number;
  /** A string representing the type of key tensors. */
  type_k: string;
  /** A string representing the type of value tensors. */
  type_v: string;
  /** A number representing the number of GPU layers. */
  n_gpu_layers: number;
  /** A string representing the split mode. */
  split_mode: string;
  /** A number representing the main GPU index. */
  main_gpu: number;
  /** A boolean indicating whether key-value offloading is disabled. */
  no_kv_offload: boolean;
  /** A boolean indicating whether flash attention is enabled. */
  flash_attn: boolean;
  /** A string representing the tensor split configuration. */
  tensor_split: string;
  /** A boolean indicating whether memory-mapped files are used. */
  use_mmap: boolean;
  /** A boolean indicating whether embeddings are used. */
  embeddings: boolean;
  /** A number representing the number of prompt tokens. */
  n_prompt: number;
  /** A number representing the number of generated tokens. */
  n_gen: number;
  /** A string representing the timestamp of the test. */
  test_time: string;
  /** A number representing the average time in nanoseconds. */
  avg_ns: number;
  /** A number representing the standard deviation of time in nanoseconds. */
  stddev_ns: number;
  /** A number representing the average time in seconds. */
  avg_ts: number;
  /** A number representing the standard deviation of time in seconds. */
  stddev_ts: number;
  /** An array of numbers representing individual time samples in nanoseconds. */
  samples_ns: number[];
  /** An array of numbers representing individual time samples in seconds. */
  samples_ts: number[];
}

/** a bench is run twice with two metrics returned */
export type BenchResult = [
  pp: Bench,
  tg: Bench,
];

export interface SimplifiedBench {
  /* Fully qualified path to model file */
  model: string;
  model_name: string;
  model_type: string;
  model_size: number;
  model_n_params: number;

  cpu_info: string;
  gpu_info: string;
  backends: string;

  n_batch: number;
  n_ubatch: number;
  n_threads: number;

  type_k: string;
  type_v: string;

  flash_attn: boolean;
  embeddings: boolean;
  use_mmap: boolean;

  prompt_run: {
    avg_ts: number;
    stddev_ts: number;
  };

  gen_run: {
    avg_ts: number;
    stddev_ts: number;
  };

  test_time: Iso8601DateTime;
}
