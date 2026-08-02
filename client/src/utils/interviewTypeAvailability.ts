export type InterviewTypeId = "technical" | "behavioral" | "coding";

export function isInterviewTypeAvailable(type: InterviewTypeId) {
  return type === "technical";
}
