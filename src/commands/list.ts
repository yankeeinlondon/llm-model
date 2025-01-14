import type { CliSwitches } from "../types";
import { log } from "node:console";
import chalk from "chalk";
import { getLocalModelsAsLinks } from "../util/getLocalModels";
import { getRunningJobs } from "../util";

export async function list(args: string[], switches: CliSwitches) {
  const verbose = switches.boolean.includes("-v");
  const names = await getLocalModelsAsLinks(args[0], verbose);

  log(chalk.bold.green(`\nDownloaded Models\n`));
  log(names.join("\n"));

  const jobs = await getRunningJobs();
  if(jobs.length > 0) {
    log(chalk.bold.green(`\nRunning Servers\n`));
    for (const job of jobs) {
      log(`- ${job.pretty} [ pid: ${chalk.bold.yellow(job.pid)}, port: ${chalk.bold.yellow(job.port)}, model: ${chalk.blue(job.model?.replace(".gguf",""))} ]`);
    }
  }  
}
