import { infer } from "inferred-types";

export interface Variant {
  name: string;
  variants: string[];
}

/**
 * returns a list of variants where multi-file variants are just a single entry
 */
export function collapseMultifileModels(variants: string[]): Variant[] {
  const output: Variant[] = [];
  for (const v of variants) {
    const match = infer(`{{infer Model}}/{{infer File}}-{{infer Index extends string}}-of-{{infer Total extends string}}.{{infer Rest}}`)(v);
    if (match && match.Index === "00001") {
      const { Total, File, Model, Rest } = match;
      const files: string[] = [];
      for (const [i] of Array.from({ length: Number(Total) }).entries()) {
        files.push(`${Model}-${File}-0000${i}-of-${Total}.${Rest}`);
      }

      output.push({
        name: `${match.Model}-${match.File}`,
        variants: files,
      });
    }
    else {
      output.push({
        name: v,
        variants: [v],
      });
    }
  }

  return output;
}
