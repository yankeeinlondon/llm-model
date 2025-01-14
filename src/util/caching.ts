import type { HuggingFaceRepo } from "../api";
import type { Job, SimplifiedBench } from "../types";
import { exec } from "node:child_process";
import { log } from "node:console";
import { existsSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";
import { BENCH_CACHE, CONFIG_BASE_DIR, CONFIG_DIR, HOME_DIR, JOBS_CACHE, LAST_MODEL_SET, MODEL_CACHE, VARIANT_CACHE } from "../constants";
import { isPortInUse } from "./isPortInUse";
import { getUniqueMemorableName } from "./memorableName";

export function getFileBase(): string {
  const dir = existsSync(CONFIG_BASE_DIR)
    ? CONFIG_DIR
    : HOME_DIR;

  if (dir === CONFIG_BASE_DIR && !existsSync(CONFIG_DIR)) {
    exec(`mkdir "${CONFIG_DIR}"`);
  }

  if (!dir) {
    throw new Error(`Could not resolve base directory!`);
  }

  return dir;
}

export async function saveVariantsToFile(v: string[]) {
  const filepath = join(getFileBase(), VARIANT_CACHE);
  return Bun.write(filepath, v);
}

export async function getVariantsFromFile(): Promise<string[]> {
  const filepath = join(getFileBase(), VARIANT_CACHE);
  const variants = await Bun.file(filepath).json();

  return variants;
}

export async function saveModelsCache(v: HuggingFaceRepo[]) {
  const filepath = join(getFileBase(), MODEL_CACHE);
  return Bun.write(filepath, JSON.stringify(v));
}

export async function getModelsCache() {
  const filepath = join(getFileBase(), MODEL_CACHE);
  return Bun.file(filepath).json() as Promise<HuggingFaceRepo[]>;
}

export async function saveLastModelSet(v: HuggingFaceRepo[]) {
  const filepath = join(getFileBase(), LAST_MODEL_SET);
  return Bun.write(filepath, JSON.stringify(v));
}

export async function getLastModelSet() {
  const filepath = join(getFileBase(), LAST_MODEL_SET);
  const file = Bun.file(filepath);
  if (await file.exists()) {
    return file.json() as Promise<HuggingFaceRepo[]>;
  }
  else {
    log(chalk.dim(`\n- no model results cached yet (${filepath})\n`));

    return [];
  }
}

export async function getBenchCache() {
  const filepath = join(getFileBase(), BENCH_CACHE);
  const file = Bun.file(filepath);

  return await file.exists()
    ? file.json() as Promise<SimplifiedBench[]>
    : [] as SimplifiedBench[];
}

export async function updateBenches(benches: SimplifiedBench[]) {
  const filepath = join(getFileBase(), BENCH_CACHE);
  const file = Bun.file(filepath);
  const data = (
    await file.exists()
      ? await file.json()
      : []
  ) as SimplifiedBench[];

  for (const b of benches) {
    const idx = data.findIndex(i => i.model === b.model);
    if (idx !== -1) {
      data.splice(idx, 1);
    }
    data.push(b);
  }

  return Bun.write(filepath, JSON.stringify(data));
}

export async function getRunningJobs() {
  const filepath = join(getFileBase(), JOBS_CACHE);
  const file = Bun.file(filepath);
  const jobs = (
    await file.exists()
      ? await file.json()
      : []
  ) as Job[];

  const active: Job[] = [];

  for (const job of jobs) {
    const listening = await isPortInUse(job.port);
    if (listening) {
      active.push(job);
    }
  }

  await file.write(JSON.stringify(active));

  return active;
}

export async function addJob(
  pid: number,
  port: number,
  model: string,
  draftModel?: string,
) {
  const filepath = join(getFileBase(), JOBS_CACHE);
  const file = Bun.file(filepath);
  const jobs = await getRunningJobs();

  const [name, pretty] = await getUniqueMemorableName();

  const job = {
    model,
    draftModel,
    pid,
    port,
    name,
    pretty,
    start: new Date().toISOString(),
  };

  await file.write(JSON.stringify([...jobs, job]));

  return job.name;
}
