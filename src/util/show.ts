import type { HuggingFaceRepo } from "../api";
import chalk from "chalk";
import { linkToModel } from "./link";
import { pipelineTag } from "./tag";

export function showRepoModel(model: HuggingFaceRepo, addLink: boolean = true) {
  const likesInfo = model.likes ? ` (${chalk.yellowBright(model.likes)} 👍)` : "";
  const t = model.pipeline_tag ? ` → ${pipelineTag(model.pipeline_tag)}` : "";

  return addLink
    ? `- ${linkToModel(model.id)}${likesInfo}${t}`
    : `- ${model.id}${likesInfo}${t}`;
}
