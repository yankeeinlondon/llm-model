import type { ExpandDictionary } from "inferred-types";
import type {
  LLAMA_CPP_BOOLEAN,
  LLAMA_CPP_NUMBER,
  LLAMA_CPP_STRING,
} from "../constants";

export type FirstOfEach<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends readonly unknown[] ? T[K][0] : never;
}[number];

export type SecondOfEach<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends readonly unknown[] ? T[K][1] : never;
}[number];

export type Param = [long: string, short: string, desc: string];

export type SwitchBoolLong = Exclude<FirstOfEach<typeof LLAMA_CPP_BOOLEAN>, "">;
export type SwitchBoolShort =
    | "-i"
    | Exclude<SecondOfEach<typeof LLAMA_CPP_BOOLEAN>, "">;
export type BooleanSwitch = SwitchBoolLong | SwitchBoolShort;

export type SwitchStringLong = Exclude<
  FirstOfEach<typeof LLAMA_CPP_STRING>,
  ""
>;
export type SwitchStringShort = Exclude<
  SecondOfEach<typeof LLAMA_CPP_STRING>,
  ""
>;
export type StringSwitch = SwitchStringLong | SwitchStringShort;

export type SwitchNumberLong = Exclude<
  FirstOfEach<typeof LLAMA_CPP_NUMBER>,
  ""
>;
export type SwitchNumberShort = Exclude<
  SecondOfEach<typeof LLAMA_CPP_NUMBER>,
  ""
>;
export type NumericSwitch = SwitchNumberLong | SwitchNumberShort;

export interface CliSwitches {
  boolean: BooleanSwitch[];
  string: [name: StringSwitch, val: string][];
  number: [name: NumericSwitch, val: number][];
  unknown: `-${string}`[];
}

export interface BenchSwitches {
  boolean: BooleanSwitch[];
  string: [name: StringSwitch | "-o", val: string][];
  number: [name: NumericSwitch, val: number][];
  unknown: `-${string}`[];
}

/**
 * the CLI's configuration represented as a key/value
 * pairing of CLI switches
 */
export type CliConfig = ExpandDictionary<
    Record<NumericSwitch, number | undefined> &
    Record<StringSwitch, string | undefined> &
    Record<BooleanSwitch, true | undefined> & {
      "--port": number;
      "--host": string;
      "--log-file": string;
      "-m": string;
    }
>;
