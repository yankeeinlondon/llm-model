const KNOWN_EXT = [
  ".gguf",
  ".ggml",
  ".mo",
  ".mlmodel",
  ".bin",
  ".pt",
  ".pth",
  ".cnn",
  ".int8",
  ".fp16",
  ".mlir",
  ".ort",
  ".safetensors",
];

export const modelFileExtensions = (file: string) => KNOWN_EXT.some(i => file.endsWith(i));
