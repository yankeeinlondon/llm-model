import fs, { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Download a file from a "model repo" on HuggingFace with progress logging,
 * using Node's built-in fetch and fs streams.
 */
export async function downloadModelFile(
  modelName: string,
  fileName: string,
  outputDir: string,
): Promise<void> {
  const fileUrl = `https://huggingface.co/${modelName}/resolve/main/${fileName}`;

  // Node 18+ has a built-in fetch, but it might still be marked experimental.
  // Alternatively, you can use "node-fetch" if needed:
  // import fetch from "node-fetch";
  // const response = await fetch(fileUrl, { ... });
  // (Adjust accordingly for Node <18.)
  const response = await fetch(fileUrl, {
    // Include your authorization token or other headers as needed
    // headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
  });

  if (!response.ok) {
    throw new Error(`File download failed: ${response.status} ${response.statusText}`);
  }

  // Try to get total size from Content-Length
  const contentLengthHeader = response.headers.get("content-length");
  const totalBytes = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : null;

  // Create or ensure the output directory
  mkdirSync(outputDir, { recursive: true });

  const localFilePath = path.join(outputDir, fileName);
  const fileStream = fs.createWriteStream(localFilePath, { flags: "w" }); // Overwrite mode

  if (!response.body) {
    throw new Error("Response body is null. Cannot proceed with download.");
  }

  let downloadedBytes = 0;
  let lastLoggedPercentage = 0;

  // We’ll read from the stream in a loop
  const reader = response.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      if (value) {
        fileStream.write(value);
        downloadedBytes += value.length;

        if (totalBytes && totalBytes > 0) {
          // Calculate download percentage
          const percentage = ((downloadedBytes / totalBytes) * 100).toFixed(2);
          if (
            Number.parseFloat(percentage) - lastLoggedPercentage >= 1
            || downloadedBytes === totalBytes
          ) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(
              `Downloading: ${percentage}% (${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB)`,
            );
            lastLoggedPercentage = Number.parseFloat(percentage);
          }
        }
        else {
          // If total size is unknown, log every MB
          if (downloadedBytes % (1024 * 1024) < value.length) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(
              `Downloaded: ${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB`,
            );
          }
        }
      }
    }
  }
  catch (error) {
    // Ensure we close the file stream on error
    fileStream.close();
    throw error;
  }

  // Close the file stream when done
  fileStream.end();

  console.log(
    `\nDownloaded: ${localFilePath} [${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB]`,
  );
}
