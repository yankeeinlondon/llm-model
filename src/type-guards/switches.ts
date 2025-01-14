import type {
  SwitchBoolLong,
  SwitchBoolShort,
  SwitchNumberLong,
  SwitchNumberShort,
  SwitchStringLong,
  SwitchStringShort,
} from "../types";
import { isString } from "inferred-types";
import { LLAMA_CPP_BOOLEAN, LLAMA_CPP_NUMBER, LLAMA_CPP_STRING } from "../constants";

export function isBoolSwitch(val: unknown): val is SwitchBoolLong | SwitchBoolShort {
  return isString(val)
      && val.startsWith("-")
      && LLAMA_CPP_BOOLEAN.some(i => i[0] === val || i[1] === val);
}

export function isStringSwitch(val: unknown): val is SwitchStringLong | SwitchStringShort {
  return isString(val)
      && val.startsWith("-")
      && LLAMA_CPP_STRING.some(i => i[0] === val || i[1] === val);
}

export function isNumberSwitch(val: unknown): val is SwitchNumberLong | SwitchNumberShort {
  return isString(val)
      && val.startsWith("-")
      && LLAMA_CPP_NUMBER.some(i => i[0] === val || i[1] === val);
}
