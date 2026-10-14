type Raw = Record<string, string | string[] | undefined>;

/** First value of a query param, or undefined. */
export function param(sp: Raw, key: string): string | undefined {
  const value = sp[key];
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() || undefined;
}
