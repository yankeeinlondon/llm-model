import { getLocalModels } from "./getLocalModels";

export async function getMetaForLocalModels() {
  const models = await getLocalModels();
  const names = models.map(i => i.split("/").pop()).join("\n");
  const lookup = models.reduce(
    (acc, path) => {
      const key = path.split("/").pop() as string;

      return ({
        ...acc,
        [key]: path,
      });
    },
    {},
  );
  const choices = models.reduce(
    (acc, path) => {
      const key = path.split("/").pop() as string;

      return ({
        ...acc,
        [path]: key,
      });
    },
    {},
  );

  return [names, lookup, choices];
}
