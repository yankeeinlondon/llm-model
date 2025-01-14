import { spawn } from "node:child_process";
import { log } from "node:console";
import { createWriteStream } from "node:fs";
import { basename } from "node:path";
import { exit } from "node:process";
import chalk from "chalk";
import { isDefined } from "inferred-types";
import { DEFAULT_MODEL_DIR } from "../constants";
import { chooseModel } from "../questions";
import { bye, getLocalModels, isPortInUse } from "../util";

export async function speculate(args: string[]) {
  let [draft, production] = args;

  if (isDefined(draft)) {
    const draftModels = await getLocalModels(draft);
    if (draftModels.length > 0) {
      const model = basename(draftModels[0]);
      draft = draftModels[0];
      log(`- using ${chalk.bold(model)} as ${chalk.italic("draft")} model.`);
    }
    else {
      if (isDefined(draft)) {
        log(`- the model "${draft}" wasn't found locally`);
        log(`- the current model directory is: ${chalk.blue(DEFAULT_MODEL_DIR)}`);
        log();
        log(`Did you mean one of these models?`);
        const model = await chooseModel(draft.replace(".gguf", ""));

        if (!model) {
          bye();
          exit();
        }
        else {
          draft = model;
        }
      }
    }
  }
  else {
    log(`\n- no ${chalk.bold.blue("Draft Model")} specified, choose from the following:\n`);
    const model = await chooseModel();
    if (!model) {
      bye();
      exit();
    }
    draft = model;
  }

  if (isDefined(production)) {
    const localModels = await getLocalModels(production);
    if (localModels.length > 0) {
      draft = localModels[0];
      const modelName = basename(draft);
      log(`- using ${chalk.bold(modelName)} as ${chalk.italic("main")} model.`);
    }
    else {
      log(`- the model "${production}" wasn't found locally`);
      log(`- the current model directory is: ${chalk.blue(DEFAULT_MODEL_DIR)}`);
      log();
      log(`Did you mean one of these models?`);
      const model = await chooseModel(production.replace(".gguf", ""));
      if (!model) {
        bye();
        exit();
      }
      else {
        production = model;
      }
    }
  }
  else {
    log(`\n- no ${chalk.bold.blue("Main Model")} specified, choose from the following:\n`);
    const model = await chooseModel();
    if (!model) {
      bye();
      exit();
    }
    production = model;
  }

  const port = 8087;
  if (await isPortInUse(port)) {
    log(`${chalk.red("Error:")} Port ${port} is already in use. Please use a different port.`);
    exit(1);
  }

  log(`\nStarting speculative LLM using ${chalk.green("llama.cpp")}`);
  const params = [
    `-m`,
    production,
    `-md`,
    draft,
    `-c`,
    "4096",
    `-cd`,
    "4096",
    `-ngl`,
    "99",
    `--draft-max`,
    "8",
    `--draft-min`,
    "4",
    `--draft-p-min`,
    "0.9",
    `--host`,
    "0.0.0.0",
    `--port`,
    port.toString(),
  ];

  const logFilePath = `llama-server-${Date.now()}.log`;
  const logStream = createWriteStream(logFilePath, { flags: "a" });

  const child = spawn("llama-server", params, {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  // Pipe STDOUT and STDERR to the log file
  child.stdout?.pipe(logStream);
  child.stderr?.pipe(logStream);

  // Detach the child process so it can continue independently
  child.unref();

  const pid = child.pid;
  log(`- Speculative LLM spawned and running with PID: ${pid}`);
  log(`- Logs are being written to: ${chalk.blue(logFilePath)}`);
  log();
  log(
    `- You can rerun this model combination with:\n     ${chalk.blue(
      `model speculate ${basename(draft)} ${basename(production)}`,
    )}`,
  );
  log();
}
