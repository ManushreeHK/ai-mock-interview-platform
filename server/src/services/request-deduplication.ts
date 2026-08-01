const inFlightRequests = new Map<string, Promise<unknown>>();

export function runDeduplicated<T>(
  key: string,
  operation: () => Promise<T>
): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) return existing as Promise<T>;

  const pending = operation().finally(() => {
    if (inFlightRequests.get(key) === pending) {
      inFlightRequests.delete(key);
    }
  });

  inFlightRequests.set(key, pending);
  return pending;
}
