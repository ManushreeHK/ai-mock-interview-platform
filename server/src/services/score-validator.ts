export class InvalidScoreError extends Error {
  constructor(readonly fieldName: string) {
    super(`Invalid score for ${fieldName}.`);
    this.name = "InvalidScoreError";
  }
}

export function validateScore(
  value: unknown,
  fieldName: string
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 10
  ) {
    throw new InvalidScoreError(fieldName);
  }

  return value;
}
