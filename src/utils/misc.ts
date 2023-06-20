export function intersection<T>(ls1: T[], ls2: T[]): T[] {
  const set2 = new Set(ls2);
  return ls1.filter((e) => set2.has(e));
}

export function splitLast(s: string, sep: string): [string, string] {
  let i = s.lastIndexOf(sep);
  if (i === -1) {
    i = s.length;
  }
  return [s.slice(0, i), s.slice(i + sep.length)];
}
