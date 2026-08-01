import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import {
  createEvaluateInterviewHandler,
  getEvaluationHttpError,
} from "../src/controllers/interview.controller.js";
import { AiServiceError } from "../src/services/gemini-reliability.js";
import { evaluateAndSaveInterview } from "../src/services/interview.service.js";
import type { InterviewResult } from "../src/models/interview-result.js";
import {
  InvalidScoreError,
  validateScore,
} from "../src/services/score-validator.js";

const requestBody = {
  type: "technical",
  role: "Developer",
  experience: "Junior",
  difficulty: "Easy",
  language: "TypeScript",
  questions: ["What is TypeScript?"],
  answers: ["A typed superset of JavaScript."],
};

const validEvaluation = JSON.stringify({
  overallScore: 8,
  communication: 8,
  technicalKnowledge: 8,
  confidence: 8,
  strengths: ["Clear answer"],
  weaknesses: ["Add an example"],
  questionEvaluation: [
    {
      question: requestBody.questions[0],
      score: 8,
      feedback: "Good answer.",
    },
  ],
});

const savedResult: InterviewResult = {
  userId: "test-user",
  interviewId: "test-interview",
  ...requestBody,
  evaluation: JSON.parse(validEvaluation) as InterviewResult["evaluation"],
  status: "completed",
  createdAt: "2026-01-01T00:00:00.000Z",
};

async function postEvaluation(
  operation: Parameters<typeof createEvaluateInterviewHandler>[0]
) {
  const app = express();
  app.use(express.json());
  app.post(
    "/api/interview/evaluate",
    (req, _res, next) => {
      req.authenticatedUser = {
        sub: "test-user",
        username: "test-user",
        clientId: "test-client",
        scope: "",
        groups: [],
      };
      next();
    },
    createEvaluateInterviewHandler(operation, () => undefined)
  );

  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(
      `http://127.0.0.1:${port}/api/interview/evaluate`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test("successful evaluation returns the saved result", async () => {
  const response = await postEvaluation((input) =>
    evaluateAndSaveInterview(input, {
      evaluateAnswers: async () => ({
        text: validEvaluation,
        model: "gemini-fallback",
        fallback: true,
      }),
      saveResult: async () => savedResult,
    })
  );
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { success: true, result: savedResult });
});

test("Gemini quota errors remain standardized 429 responses", async () => {
  const error = new AiServiceError(
    429,
    "AI_QUOTA_EXCEEDED",
    "The AI usage limit has been reached. Please try again later.",
    "gemini-primary",
    false
  );
  const response = await postEvaluation(async () => {
    throw error;
  });
  assert.equal(response.status, 429);
  assert.deepEqual(response.body, getEvaluationHttpError(error).body);
});

test("Gemini unavailable errors remain standardized 503 responses", async () => {
  const error = new AiServiceError(
    503,
    "AI_SERVICE_BUSY",
    "The AI service is temporarily busy. Please try again shortly.",
    "gemini-fallback",
    true
  );
  const response = await postEvaluation(async () => {
    throw error;
  });
  assert.equal(response.status, 503);
  assert.deepEqual(response.body, getEvaluationHttpError(error).body);
});

test("malformed Gemini JSON identifies response parsing and returns 502", async () => {
  const response = await postEvaluation((input) =>
    evaluateAndSaveInterview(input, {
      evaluateAnswers: async () => ({
        text: "not valid json",
        model: "gemini-fallback",
        fallback: true,
      }),
      saveResult: async () => {
        throw new Error("save must not run");
      },
    })
  );
  assert.equal(response.status, 502);
  assert.deepEqual(response.body, {
    error: {
      code: "AI_RESPONSE_INVALID",
      message:
        "The AI returned an invalid evaluation response. Please try again.",
    },
  });
});

test("DynamoDB PutItem failures are distinct 503 responses", async () => {
  const response = await postEvaluation((input) =>
    evaluateAndSaveInterview(input, {
      evaluateAnswers: async () => ({
        text: validEvaluation,
        model: "gemini-primary",
        fallback: false,
      }),
      saveResult: async () => {
        throw new Error("simulated PutItem failure");
      },
    })
  );
  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    error: {
      code: "RESULT_SAVE_FAILED",
      message:
        "The evaluation was completed but could not be saved. Please try again.",
    },
  });
});

test("unknown evaluation errors return standardized 500 responses", async () => {
  const response = await postEvaluation(async () => {
    throw new Error("unknown internal failure");
  });
  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to evaluate the interview.",
    },
  });
});

test("score validator accepts zero", () => {
  assert.equal(validateScore(0, "score"), 0);
});

test("score validator accepts ten", () => {
  assert.equal(validateScore(10, "score"), 10);
});

test("score validator accepts decimal scores", () => {
  assert.equal(validateScore(8.5, "score"), 8.5);
});

for (const [label, value] of [
  ["score 14", 14],
  ["score 20", 20],
  ["negative score", -1],
  ["NaN score", Number.NaN],
  ["string score", "8"],
] as const) {
  test(`score validator rejects ${label}`, () => {
    assert.throws(
      () => validateScore(value, "score"),
      InvalidScoreError
    );
  });
}

test("invalid nested question score is rejected before save", async () => {
  let saveCalled = false;
  const invalidNestedScore = JSON.stringify({
    ...JSON.parse(validEvaluation),
    questionEvaluation: [
      {
        question: requestBody.questions[0],
        score: 14,
        feedback: "Invalid score.",
      },
    ],
  });

  await assert.rejects(
    evaluateAndSaveInterview(
      { userId: "test-user", ...requestBody },
      {
        evaluateAnswers: async () => ({
          text: invalidNestedScore,
          model: "gemini-primary",
          fallback: false,
        }),
        saveResult: async () => {
          saveCalled = true;
          return savedResult;
        },
      }
    ),
    (error: unknown) =>
      getEvaluationHttpError(error).body.error.message ===
      "The AI returned invalid scoring data. Please try again."
  );

  assert.equal(saveCalled, false);
});
