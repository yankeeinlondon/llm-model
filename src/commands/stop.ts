import { exec } from "node:child_process";
import { log } from "node:console";
import { exit } from "node:process";
import chalk from "chalk";
import { isNumberLike, type NumberLike } from "inferred-types";
import { getRunningJobs } from "../util";

// Promise wrapper for exec
function execPromise(command: string) {
  return new Promise((resolve, reject) =>
    exec(command, (err, stdout, stderr) => {
      if (err)
        reject(err);
      else resolve({ stdout, stderr });
    }),
  );
}

async function kill(pid: number) {
  let command: string;
  if (process.platform === "win32") {
    command = `taskkill /PID ${pid} /F`;
  }
  else {
    command = `kill ${pid}`;
  }
  try {
    await execPromise(command);
    // Process killed successfully
  }
  catch (err) {
    // Handle errors, e.g., process does not exist
    console.error(`Error killing process ${pid}:`, err);
  }
}

export async function stop(args: string[]) {
  const unrecognized: string[] = [];
  const pids: NumberLike[] = [];
  const friendly: string[] = [];
  const servers = await getRunningJobs();

  if (args.length === 0) {
    // TODO interactive
  }

  for (const arg of args) {
    if (isNumberLike(arg)) {
      pids.push(arg);
    }
    else if (arg.includes("-")) {
      friendly.push(arg);
    }
    else if (arg === "all") {
      friendly.push(...servers.map(i => i.name));
    }
    else {
      unrecognized.push(arg);
    }
  }

  if (unrecognized.length > 0) {
    log(`- unrecognized jobs specified: ${unrecognized.map(i => chalk.red(i)).join(", ")}`);
  }

  if (servers.length === 0) {
    log(`\n- no ${chalk.blue("LLama.cpp")} servers are currently running!`);
    exit(1);
  }

  for (const pid of pids) {
    const found = servers.find(i => i.pid === pid);
    if (found) {
      await kill(Number(pid));
      log(`\n- stopped ${found.pretty} [${chalk.dim("pid: ")}${chalk.whiteBright.bgGray(pid)}]`);
    }
    else {
      log(`\n- the process ${chalk.whiteBright.bgGray(pid)} is not associated to a recognized ${chalk.blue("LLama.cpp")} server`);
    }
  }

  for (const name of friendly) {
    const found = servers.find(i => i.name === name);
    if (found) {
      await kill(Number(found.pid));
      log(`\n- stopped ${found.pretty} [${chalk.dim("pid: ")}${chalk.whiteBright.bgGray(found.pid)}]`);
    }
    else {
      log(`\n- the friendly name "${chalk.blue(name)}" is not an actively running ${chalk.blue("LLama.cpp")} server!`);
    }
  }
}
