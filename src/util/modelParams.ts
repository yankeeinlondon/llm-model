import type {
  CliConfig,
  CliSwitches,
  Param,
  SwitchBoolLong,
  SwitchBoolShort,
  SwitchNumberLong,
  SwitchNumberShort,
  SwitchStringLong,
  SwitchStringShort,
} from "../types";
import chalk from "chalk";
import { isBoolean, isTrue } from "inferred-types";
import {
  CONTEXT_SIZE,
  CONTEXT_SIZE_DRAFT,
  DEFAULT_MODEL_DIR,
  DRAFT_MAX,
  DRAFT_MIN,
  DRAFT_P_MIN,
  FLASH_ATTN,
  HOST,
  LLAMA_CPP_BOOLEAN,
  LLAMA_CPP_NUMBER,
  LLAMA_CPP_STRING,
  NGL,
  NGLD,
  PORT,
  TEMP,
} from "../constants";

export function lookupBoolSwitch(sw: SwitchBoolLong | SwitchBoolShort) {
  const found = LLAMA_CPP_BOOLEAN.find(i =>
    sw.startsWith("--") ? sw === i[0] : sw === i[1],
  );
  return found as Param;
}

export function lookupStringSwitch(sw: SwitchStringLong | SwitchStringShort) {
  const found = LLAMA_CPP_STRING.find(i =>
    sw.startsWith("--") ? sw === i[0] : sw === i[1],
  );
  return found as Param;
}

export function lookupNumberSwitch(sw: SwitchNumberLong | SwitchNumberShort) {
  const found = LLAMA_CPP_NUMBER.find(i =>
    sw.startsWith("--") ? sw === i[0] : sw === i[1],
  );
  return found as Param;
}

export type LlamaCppConfig = Partial<
    Record<SwitchBoolLong | SwitchBoolShort, boolean> &
    Record<SwitchStringLong | SwitchStringShort, string> &
    Record<SwitchNumberLong | SwitchNumberShort, number>
>;

export function getModelParameters(switches: CliSwitches) {
  const s = switches;

  const defaultParams: LlamaCppConfig = {
    "-ngl": NGL,
    "-c": CONTEXT_SIZE,
    "--temp": TEMP,
    "--host": HOST,
    "--port": PORT,
    "--flash-attn": FLASH_ATTN,
    "--log-file": `${DEFAULT_MODEL_DIR}/logs/llama-server-${Date.now()}.log`,
    ...(s?.string.some(i => i[0] === "-md")
      ? ({
          "--draft-max": DRAFT_MAX,
          "--draft-min": DRAFT_MIN,
          "--draft-p-min": DRAFT_P_MIN,
          "-cd": CONTEXT_SIZE_DRAFT,
          "-ngld": NGLD,
        } satisfies LlamaCppConfig)
      : {}),
  };

  const cliParams: LlamaCppConfig = {
    ...switches.boolean.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    ...switches.string.reduce(
      (acc, kv) => ({ ...acc, [kv[0]]: String(kv[1]) }),
      {},
    ),
    ...switches.number.reduce(
      (acc, kv) => ({ ...acc, [kv[0]]: Number(kv[1]) }),
      {},
    ),
  };

  return {
    ...defaultParams,
    ...cliParams,
  };
}

export function createCliParamsForModel(
  switches: CliSwitches,
  model: string,
  draftModel?: string,
) {
  const cli: [param: string, value: string | number | boolean | undefined][] = [
    ["-m", model],
  ];

  if (draftModel) {
    cli.push(["-md", draftModel]);
  }

  const config = getModelParameters(switches);

  for (const key of Object.keys(config).filter(
    i => !["m", "md"].includes(i),
  )) {
    const value = config[key as keyof typeof config];
    if (value) {
      cli.push([key, isTrue(value) ? "" : String(value)]);
    }
  }

  const prettyDesc = `${chalk.bold.yellowBright("llama-server")} ${cli.map(([key, val]) => `${chalk.dim(key)} ${isBoolean(val) ? "" : chalk.blue(val)}`).join(" \\\n    ")}`;

  return [cli, config, prettyDesc, switches.unknown] as [
    [string, string][],
    CliConfig,
    string,
    string[],
  ];
}
