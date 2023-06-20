import { tinyassert } from "@hiogawa/utils";

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

function splitEnd(s: string, sep: string): string | undefined {
  const i = s.lastIndexOf(sep);
  return i !== -1 ? s.slice(0, i) : undefined;
}

function normalizeGlobModuleKey(
  key: string,
  prefix: string,
  preExtension: string
) {
  tinyassert(key.startsWith(prefix));
  const key1 = key.slice(prefix.length);
  const key2 = splitEnd(key1, preExtension);
  tinyassert(key2);
  return key2;
}
