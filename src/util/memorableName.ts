import chalk from "chalk";
import { getRunningJobs } from "./caching";

const things = [
  "monkey",
  "dog",
  "chihuahua",
  "cat",
  "parrot",
  "eagle",
  "hawk",
  "worm",
  "octopus",
  "ape",
  "man",
  "woman",
  "peanut",
  "apple",
  "pear",
  "grapes"
]

const color = [
  "red",
  "blue",
  "purple",
  "green",
  "yellow",
  "grey"
]

const modifier = [
  "dancing",
  "running",
  "screaming",
  "jumping",
  "laughing",
  "crying",
  "falling"
]

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function memorableName() {
  const name = `${random(color)}-${random(modifier)}-${random(things)}`
  return [
    name,
    name.includes("yellow")
      ? chalk.bgYellow.blackBright(name)
      : name.includes("green")
      ? chalk.bgGreen.blackBright(name)
      : name.includes("blue")
      ? chalk.bgBlue.blackBright(name)
      : name.includes("red")
      ? chalk.bgRed.blackBright(name)
      : name.includes("purple")
      ? chalk.bgMagenta.blackBright(name)
      : name.includes("grey")
      ? chalk.bgGrey(name)
      : name
  ];
}

export async function getUniqueMemorableName() {
  const IN_USE = (await getRunningJobs()).map(i => i.name);
  let [name, pretty] = memorableName();

  while(IN_USE.includes(name)) {
    [name, pretty] = memorableName();
  }

  return [name, pretty]
}
