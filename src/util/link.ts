/**
 * **link**`(text, link)`
 *
 * Prints a link to the terminal using a relatively new
 * [standard](https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda) for making pretty links.
 *
 * You can use the following protocols for your links:
 * - `http` / `https`
 * - `file` (note format is `file://hostname/path/to/file.txt` and hostname
 * IS required)
 * - `mailto`
 * - `
 */
export function link(text: string, link: string) {
  return `\x1B]8;;${link}\x1B\\${text}\x1B]8;;\x1B\\`;
}

// https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF

/**
 * returns the URL to a Hugging Face model repo.
 *
 * **Related:** `linkToModel()`, `link()`
 */
export function urlToModel(model: string) {
  return `https://huggingface.co/${model}`;
}

/**
 * Returns a link to a HuggingFace model repo.
 *
 * **Related:** `urlToModel()`, `link()`
 */
export function linkToModel(model: string) {
  return link(model, `https://huggingface.co/${model}`);
}
