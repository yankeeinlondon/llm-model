import type { CliSwitches } from "../types";
import { spawn } from "node:child_process";
import { log } from "node:console";
import { basename } from "node:path";
import { exit, stderr, stdin, stdout } from "node:process";

import { createInterface } from "node:readline";
import chalk from "chalk";
import { isDefined } from "inferred-types";
import { chooseModel } from "../questions";
import {
  addJob,
  bye,
  createCliParamsForModel,
  getLocalModels,
  getLocalModelsAsChoices,
  link,
  waitForFile,
} from "../util";

async function getModel(modelRef: string | undefined): Promise<string | false> {
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

export async function run(args: string[], switches: CliSwitches) {
  const model = await getModel(args[0]);

  if (!model) {
    bye();
    exit();
  }

  if (switches.boolean.includes("-i")) {
    // TODO
  }
  else {
    log(
      `- you can use ${chalk.blue("-i")} CLI switch to set model params interactively.`,
    );
    log(`- using default params for model unless ENV vars set:\n`);
  }

  const [cli, params, desc, unknown] = createCliParamsForModel(switches, model);

  log(chalk.bold("Running Llama.cpp Server:"));
  log(chalk.bold("-------------------------\n"));

  log(desc);

  log();
  const listening = chalk.bold.green(
    `http://${params["--host"]}${chalk.reset.green(`:${params["--port"]}`)}`,
  );
  const url = `http://${params["--host"]}:${params["--port"]}`;
  log(`- model is being run in the background at ${link(listening, url)}`);

  if (unknown.length > 0) {
    log(`🐞 ${chalk.redBright("unknown CLI switches")}: ${unknown.join(", ")}`);
  }

  const server = spawn("llama-server", cli.flat(), {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  server.on("error", (err) => {
    log(chalk.red(`Failed to start server: ${err.message}`));
    exit(1);
  });

  server.on("stdout", (data) => {
    log("server<stdout>:", data.toString());
  });

  server.on("stderr", (data) => {
    log("server<stderr>:", data.toString());
  });

  // Detach the child process so it can continue independently
  server.unref();

  const pid = server.pid as number;
  const name = await addJob(pid, params["--port"], basename(model));

  const logFile = params["--log-file"];
  log(`- Running with PID: ${pid}, friendly name of: ${name}`);
  log(`- Logs are being written to: ${chalk.blue(logFile)}`);
  log(
    `- we will now ${chalk.italic("tail")} the logs for you but yoo can ctrl-c to stop`,
  );
  log(`  watching the logs and server will continue to run in the background`);
  log();

  const fileExists = await waitForFile(logFile, 5000);
  if (!fileExists) {
    log(chalk.red(`- the log file ${logFile} does not exist yet!`));
    exit(1);
  }

  const tail = spawn("tail", ["-f", params["--log-file"]], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  tail.stdout.on("data", (data) => {
    stdout.write(data);
  });

  tail.stderr.on("data", (data) => {
    stderr.write(data);
  });

  // Setup readline interface for handling 'q' press
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  // Put stdin in raw mode to handle single keystrokes
  stdin.setRawMode(true);
  stdin.resume();

  stdin.on("data", (key) => {
    // 'q' or 'Q'
    if (key.toString() === "q" || key.toString() === "Q") {
      log(chalk.yellow("\n\nStopping both logs and server..."));
      tail.kill();
      process.kill(-server.pid!); // Note the minus sign to kill the process group
      rl.close();
      exit(0);
    }
  });

  // Handle ctrl-c
  process.on("SIGINT", () => {
    log(
      chalk.yellow(
        "\n\nStopped watching logs but server continues to run in background",
      ),
    );
    log();
    log(
      chalk.dim(
        `- to view logs again: ${chalk.blue(`tail -f ${link(logFile, `file://${logFile}`)}`)}`,
      ),
    );
    log(chalk.dim(`- to stop server: ${chalk.blue(`kill ${pid}`)}`));
    log();
    tail.kill();
    rl.close();
    exit(0);
  });

  // Clean up if the process exits
  process.on("exit", () => {
    stdin.setRawMode(false);
    stdin.pause();
  });
}
