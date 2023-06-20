import { tinyassert } from "@hiogawa/utils";
import { splitLast } from "./misc";

export function normalizeGlobImport<T>(
  modules: Record<string, T>,
  prefix: string,
  preExtension: string
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(modules).map(([k, v]) => [
      normalizeGlobModuleKey(k, prefix, preExtension),
      v,
    ])
  );
}

function normalizeGlobModuleKey(
  key: string,
  prefix: string,
  preExtension: string
) {
  tinyassert(key.startsWith(prefix));
  const key1 = key.slice(prefix.length);
  const [key2] = splitLast(key1, preExtension);
  return key2;
}
