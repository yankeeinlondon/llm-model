import { exit } from "node:process";
import { AUTH_TOKEN, HUGGINGFACE_API_URL } from "../constants";

export async function fetchWithAuth(endpoint: string): Promise<any> {
  if (!AUTH_TOKEN) {
    console.error("Error: HUGGINGFACE_AUTH_TOKEN is not set in the environment.");
    exit(1);
  }

  const response = await fetch(`${HUGGINGFACE_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
