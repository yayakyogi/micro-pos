export function paramsToObject(entries: any) {
  const results: any = {};

  for (const [key, value] of entries) {
    results[key] = value;
  }

  return results;
}
