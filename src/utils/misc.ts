export function splitEnd(s: string, sep: string): string | undefined {
  const i = s.lastIndexOf(sep);
  return i !== -1 ? s.slice(0, i) : undefined;
}
