import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  hasTechnicalInterviewFormErrors,
  validateTechnicalInterviewForm,
} from "../src/utils/technicalInterviewForm.ts";
import { getApiErrorMessage } from "../src/utils/getApiErrorMessage.ts";
import axios from "axios";

const validForm = {
  role: "Frontend Developer",
  experience: "3-5 Years",
  difficulty: "Medium",
  domain: "Web Development",
  language: "TypeScript",
  position: "Senior Frontend Developer",
};

test("Technical Interview validation rejects every missing required field", () => {
  const errors = validateTechnicalInterviewForm({
    role: "",
    experience: "",
    difficulty: "",
    domain: "",
    language: "",
    position: "   ",
  });

  assert.deepEqual(errors, {
    role: "Please select a role.",
    experience: "Please select experience.",
    difficulty: "Please select difficulty.",
    domain: "Please select domain.",
    language: "Please select programming language.",
    position: "Position is required.",
  });
  assert.equal(hasTechnicalInterviewFormErrors(errors), true);
});

test("Technical Interview validation accepts a complete configuration", () => {
  const errors = validateTechnicalInterviewForm(validForm);
  assert.equal(hasTechnicalInterviewFormErrors(errors), false);
  assert.deepEqual(Object.values(errors), ["", "", "", "", "", ""]);
});

test("API error messages use safe server messages and deterministic fallback copy", () => {
  const responseError = new axios.AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, {
    data: { error: { message: "AI service is temporarily unavailable." } },
    status: 503,
    statusText: "Service Unavailable",
    headers: {},
    config: { headers: {} as never },
  });
  assert.equal(getApiErrorMessage(responseError, "Fallback"), "AI service is temporarily unavailable.");
  assert.equal(getApiErrorMessage(new Error("network"), "Fallback"), "Fallback");
});

test("New Interview and Active Interview expose loading and retry-safe failure states", () => {
  const create = readFileSync("src/pages/CreateInterview/CreateInterviewPage.tsx", "utf8");
  const interview = readFileSync("src/pages/Interview/InterviewPage.tsx", "utf8");

  assert.match(create, /isLoading={loading}/);
  assert.match(create, /generationInFlight\.current/);
  assert.match(create, /role="alert"/);
  assert.match(interview, /submissionInFlight\.current/);
  assert.match(interview, /isSubmitting={isSubmitting}/);
  assert.match(interview, /setSubmissionError/);
});
