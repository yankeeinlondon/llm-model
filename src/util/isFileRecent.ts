export async function isFileRecentlyModified(filepath: string, hours: number = 2) {
  const file = Bun.file(filepath);
  if (await file.exists()) {
    const lastModified = file.lastModified / 1000;
    const currentTime = Date.now() / 1000;
    const fourHoursAgo = currentTime - (hours * 60 * 60);

    return lastModified > fourHoursAgo;
  }

  return false;
}
