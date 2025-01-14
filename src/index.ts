#!/usr/bin/env bun

import type {
  CliSwitches,

} from "./types";
import { argv } from "bun";
import chalk from "chalk";
import { bench, download, list, run, search, speculate, variants } from "./commands";
import { remove } from "./commands/remove";
import { isBoolSwitch, isNumberSwitch, isStringSwitch } from "./type-guards";

// Main CLI logic
async function main() {
  const command = argv[2];
  const args = argv.slice(3).filter(i => !i.startsWith(`-`));
  const switches = argv.slice(3)
    .reduce(
      (acc, key, idx) => {
        return {
          ...acc,
          ...(
            isBoolSwitch(key)
              ? { boolean: [...(acc.boolean), key] }
              : isStringSwitch(key)
                ? { string: [...acc.string, [key, argv.slice(3)[idx + 1]]] }
                : isNumberSwitch(key)
                  ? { number: [...acc.number, [key, Number(argv.slice(3)[idx + 1])]] }
                  : key.startsWith("-")
                    ? { unknown: [...acc.unknown, key] }
                    : acc
          ),
        };
      },
      { boolean: [], string: [], number: [], unknown: [] } as CliSwitches,
    ) as unknown as CliSwitches;

  try {
    if (command === "search") {
      await search(args);
    }
    else if (command === "variants") {
      await variants(args);
    }
    else if (command === "list") {
      await list(args, switches);
    }
    else if (command === "speculate") {
      await speculate(args);
    }
    else if (command === "run") {
      await run(args, switches);
    }
    else if (command === "download") {
      await download(args);
    }
    else if (command === "bench") {
      await bench(args, switches);
    }
    else if (command === "remove") {
      await remove(args, switches);
    }
    else {
      console.log(chalk.bold.green("\nUsage:\n"));
      console.log("  search <partial-name>               Search for models by partial name");

      console.log(`  variants <model>                    List all file ${chalk.italic("variants")} for a model`);

      console.log(`  download <model> ${chalk.dim("<variant>")}          Download a specific file variant`);

      console.log(`  list                                List locally downloaded models and servers running`);
      console.log(`  speculate ${chalk.dim("<model>")} ${chalk.dim("<draft-model>")}     Run two models (${chalk.italic("using speculative sampling")})`);
      console.log(`  run ${chalk.dim("<model>")}                         Run a model`);
      console.log(`  bench ${chalk.dim("<model>")}                       Report benchmarks for 1:M model(s)`);
      console.log(`  remove ${chalk.dim("<model>")}                      Remove a locally installed model`);
    }
  }
  catch (error) {
    console.error("Error:", (error as Error).message);
  }
}

main();
