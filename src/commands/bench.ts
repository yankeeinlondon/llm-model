import type { BenchResult, BenchSwitches, SimplifiedBench } from "../types";
import { spawn } from "node:child_process";
import { log } from "node:console";
import { basename } from "node:path";
import { exit } from "node:process";
import chalk from "chalk";
import Table from "cli-table3";
import { chooseMultipleModels } from "../questions";
import { bye, getBenchCache, getLocalModels, toSimplifiedBench, updateBenches } from "../util";

export async function bench(args: string[], switches: BenchSwitches) {
  let models: string[] = [];
  for (const i of args) {
    const m = await getLocalModels(i);
    models.push(...m);
  }

  const m = switches.string.find(i => i[0] === "-m");
  const md = switches.string.find(i => i[0] === "-md");
  if (m) {
    models.push(m[1]);
  }
  if (md) {
    models.push(md[1]);
  }

  /** output style */
  const o = switches.string.find(i => i[0] === "-o")?.[1] || "table";
  /** force rebuild cache */
  const force = !!switches.boolean.find(i => i[0] === "-f");

  if (args.length === 0) {
    log(`- no models specified, choose from the following:\n`);

    models = await chooseMultipleModels();

    if (models.length === 0) {
      bye();
      exit();
    }
  }

  const cache = force
    ? []
    : await getBenchCache();
  const data: SimplifiedBench[] = [];
  for (const model of models) {
    const name = chalk.blue(basename(model));
    log(`- benchmarking ${name} ...`);
    const found = cache.find(i => i.model === model);
    if (found) {
      log(`- found in cache (${chalk.dim.italic(`use ${chalk.blue("-f")} switch to force reload of cache`)}!)`);
      data.push(found);
    }
    else {
      // Spawn the process and wait for it to complete
      const jsonProcess = spawn("llama-bench", [
        "-m",
        model,
        "-o",
        "json",
      ]);

      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];

      jsonProcess.stdout.on("data", (chunk) => {
        stdout.push(chunk);
      });

      jsonProcess.stderr.on("data", (chunk) => {
        stderr.push(chunk);
      });

      await new Promise((resolve, reject) => {
        jsonProcess.on("close", (code) => {
          if (code !== 0) {
            const error = new Error(`Process exited with code ${code}\n${stderr.join("")})`);
            return reject(error);
          }
          resolve(true);
        });
      });

      // Concatenate the stdout buffers and parse as JSON
      const stdoutStr = stdout.map(chunk => chunk.toString()).join("");
      let json: BenchResult;
      try {
        json = JSON.parse(stdoutStr);
      }
      catch (e) {
        const error = new Error(`Failed to parse JSON output: ${e}\nOutput:\n${stdoutStr}`);
        throw error;
      }
      data.push(toSimplifiedBench(json));
    }
  }
  log();
  if (o === "json") {
    log(data);
  }
  else {
    const columns = process.stdout.columns;
    const perCol = Math.floor(((columns - 17) / data.length) - 2);
    const tbl = new Table({
      head: ["", ...data.map(i => i.model_name.replace(".gguf", ""))],
      colWidths: [17, ...data.map(_ => perCol)],
    });
    const BILLION = 1000000000;

    tbl.push(
      { Type: data.map(i => i.model_type) },
      { Parameters: data.map(i => `${Math.floor(i.model_n_params / BILLION)} billion`) },
      { Size: data.map(i => `${Math.floor(i.model_size / BILLION)} gb`) },
      { cpu: data.map(i => chalk.dim(i.cpu_info)) },
      { gpu: data.map(i => chalk.dim(i.gpu_info)) },
      { backends: data.map(i => chalk.dim(i.backends)) },
      { kv: data.map(i => chalk.dim(`${i.type_k} / ${i.type_v}`)) },
      { threads: data.map(i => chalk.dim(i.n_threads)) },

      { "Gen (pp512)": data.map(i => `${chalk.bold(i.gen_run.avg_ts)} t/s\n ± ${chalk.dim.italic(i.gen_run.stddev_ts)}`) },
      { "Prompt (tg128)": data.map(i => `${chalk.bold(i.prompt_run.avg_ts)} t/s\n ± ${chalk.dim.italic(i.prompt_run.stddev_ts)}`) },
    );

    log(tbl.toString());
  }

  await updateBenches(data);
}
