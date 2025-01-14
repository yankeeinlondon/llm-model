import type { Iso8601DateTime } from "inferred-types";

export type Job = {
  model: string;
  draftModel?: string;
  /** memorable name */
  name: string;

  /** memorable name with color */
  pretty: string;
  pid: number;
  port: number;
  start: Iso8601DateTime;
}
