// Cheap "is this key valid" checks used by the settings screen.
import { PROVIDERS } from "./llmProviders.js";

const SONIOX_PROBE = (key) => ["https://api.soniox.com/v1/models", { headers: { Authorization: `Bearer ${key}` } }];

export async function probeKey({ name, key, fetchImpl = fetch }) {
  const [url, init] = name === "soniox" ? SONIOX_PROBE(key) : PROVIDERS[name].probe(key);
  try {
    const response = await fetchImpl(url, init);
    if (response.ok) return "ok";
    if ([400, 401, 403].includes(response.status)) return "invalid";
    return "unknown";
  } catch {
    // CORS or network failure: we cannot tell, the key may still be fine.
    return "unknown";
  }
}
