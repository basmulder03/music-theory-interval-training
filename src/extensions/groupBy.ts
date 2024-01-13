export function groupBy<T>(xs: T[], key: keyof T): { [key: string]: T[] } {
  return xs.reduce<{ [key: string]: T[] }>(
    (rv: { [key: string]: T[] }, x: T) => {
      (rv[x[key] as string] = rv[x[key] as string] || []).push(x);
      return rv;
    },
    {}
  );
}
