import chalk, { type BackgroundColorName, type ForegroundColorName } from "chalk";

export function tag(title: string, color: ForegroundColorName = "blackBright", bg: BackgroundColorName = "bgBlue") {
  return chalk[bg][color](` ${title} `);
}

export function pipelineTag(title: string) {
  return title.includes("audio")
    ? tag(title, "blackBright", "bgMagenta")
    : title.includes("image")
      ? tag(title, "blackBright", "bgGreen")
      : title.includes("text")
        ? tag(title)
        : tag(title, "whiteBright", "bgGrey");
}
