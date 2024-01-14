export function findKeyOfSubOject<T>(
  object: T,
  predicate: (value: T[keyof T]) => boolean
): Extract<keyof T, string> {
  for (let key in object) {
    const value = object[key];
    if (predicate(value)) return key;
  }
  throw new Error("Not Found");
}
