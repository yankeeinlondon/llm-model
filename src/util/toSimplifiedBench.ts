import type { Iso8601DateTime } from "inferred-types";
import type { BenchResult, SimplifiedBench } from "../types";
import { basename } from "node:path";

/**
 * converts a `BenchResult` into a `SimplifiedBench`
 */
export function toSimplifiedBench(
  bench: BenchResult,
): SimplifiedBench {
  const {
    model_filename: model,
    model_type,
    model_size,
    model_n_params,
    cpu_info,
    gpu_info,
    backends,
    n_batch,
    n_ubatch,
    n_threads,
    type_k,
    type_v,
    flash_attn,
    embeddings,
    use_mmap,
    test_time,
  } = bench[0];

  return {
    model,
    model_name: basename(model),
    model_type,
    model_size,
    model_n_params,
    cpu_info,
    gpu_info,
    backends,
    n_batch,
    n_ubatch,
    n_threads,
    type_k,
    type_v,
    flash_attn,
    embeddings,
    use_mmap,
    prompt_run: {
      avg_ts: bench[0].avg_ts,
      stddev_ts: bench[0].stddev_ts,
    },
    gen_run: {
      avg_ts: bench[1].avg_ts,
      stddev_ts: bench[1].stddev_ts,
    },

    test_time: test_time as Iso8601DateTime,
  } satisfies SimplifiedBench;
}
