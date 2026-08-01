import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import {
  createGetInterviewHistoryDetailHandler,
  createGetInterviewHistoryHandler,
} from "../src/controllers/interview.controller.js";
import {
  getInterviewHistory,
  getInterviewHistoryDetail,
  HistoryUnavailableError,
  InterviewNotFoundError,
  InvalidHistoryRequestError,
} from "../src/services/interview-history.service.js";
import {
  buildInterviewHistoryQuery,
  buildInterviewResultGet,
} from "../src/repositories/interview-result.repository.js";

const validInterviewId =
  "2026-08-01T12:00:00.000Z#550e8400-e29b-41d4-a716-446655440000";

const fullResult = (userId = "jwt-user") => ({
  userId,
  interviewId: validInterviewId,
  type: "Technical",
  role: "Frontend Developer",
  experience: "3-5 Years",
  difficulty: "Easy",
  language: "TypeScript",
  questions: ["What is React?"],
  answers: ["A UI library."],
  evaluation: {
    overallScore: 8,
    communication: 7.5,
    technicalKnowledge: 9,
    confidence: 8,
    strengths: ["Clear"],
    weaknesses: ["Add detail"],
    questionEvaluation: [
      {
        question: "What is React?",
        score: 8,
        feedback: "Good answer.",
      },
    ],
  },
  status: "completed" as const,
  createdAt: "2026-08-01T12:00:00.000Z",
});

const rawItem = (interviewId: string, createdAt: string) => ({
  interviewId,
  createdAt,
  role: "Frontend Developer",
  type: "Technical",
  difficulty: "Easy",
  status: "completed",
  evaluation: {
    overallScore: 8,
    communication: 7.5,
    technicalKnowledge: 9,
    confidence: 8,
  },
});

async function requestHistory(
  operation: Parameters<typeof createGetInterviewHistoryHandler>[0],
  query = ""
) {
  const app = express();
  app.get(
    "/api/interview/history",
    (req, _res, next) => {
      req.authenticatedUser = {
        sub: "jwt-user",
        username: "jwt-user",
        clientId: "client",
        scope: "",
        groups: [],
      };
      next();
    },
    createGetInterviewHistoryHandler(operation)
  );
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(
      `http://127.0.0.1:${port}/api/interview/history${query}`
    );
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

async function requestHistoryDetail(
  operation: Parameters<
    typeof createGetInterviewHistoryDetailHandler
  >[0],
  interviewId = validInterviewId
) {
  const app = express();
  app.get(
    "/api/interview/history/:interviewId",
    (req, _res, next) => {
      req.authenticatedUser = {
        sub: "jwt-user",
        username: "jwt-user",
        clientId: "client",
        scope: "",
        groups: [],
      };
      next();
    },
    createGetInterviewHistoryDetailHandler(operation)
  );
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(
      `http://127.0.0.1:${port}/api/interview/history/${encodeURIComponent(interviewId)}`
    );
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test("history uses the authenticated JWT subject and preserves newest-first query order", async () => {
  let queriedUser = "";
  const response = await requestHistory(async (userId, limit) => {
    queriedUser = userId;
    assert.equal(limit, 20);
    return {
      items: [
        {
          interviewId: "newest",
          createdAt: "2026-08-01T12:00:00.000Z",
          role: "Frontend Developer",
          interviewType: "Technical",
          difficulty: "Easy",
          overallScore: 9,
          communication: 9,
          technicalKnowledge: 9,
          confidence: 9,
          status: "completed",
        },
        {
          interviewId: "older",
          createdAt: "2026-07-31T12:00:00.000Z",
          role: "Backend Developer",
          interviewType: "Technical",
          difficulty: "Medium",
          overallScore: 8,
          communication: 8,
          technicalKnowledge: 8,
          confidence: 8,
          status: "completed",
        },
      ],
      nextToken: null,
    };
  });

  assert.equal(queriedUser, "jwt-user");
  assert.equal(response.status, 200);
  const body = response.body as { items: Array<{ interviewId: string }> };
  assert.deepEqual(
    body.items.map((item) => item.interviewId),
    ["newest", "older"]
  );
});

test("DynamoDB history uses Query by userId with newest-first ordering", () => {
  const query = buildInterviewHistoryQuery("jwt-user", 20);
  assert.equal(query.KeyConditionExpression, "#userId = :userId");
  assert.deepEqual(query.ExpressionAttributeValues, {
    ":userId": "jwt-user",
  });
  assert.equal(query.ScanIndexForward, false);
  assert.equal(query.Limit, 20);
  assert.ok(!query.ProjectionExpression.includes("answers"));
  assert.ok(!query.ProjectionExpression.includes("questionEvaluation"));
});

test("history service normalizes records and paginates with an opaque token", async () => {
  const cursor = {
    userId: "jwt-user",
    interviewId: "2026-07-31#cursor",
  };
  const first = await getInterviewHistory(
    "jwt-user",
    1,
    undefined,
    async () => ({
      items: [rawItem("newest", "2026-08-01T12:00:00.000Z")],
      lastEvaluatedKey: cursor,
    })
  );
  assert.equal(typeof first.nextToken, "string");

  let receivedCursor: unknown;
  const second = await getInterviewHistory(
    "jwt-user",
    1,
    first.nextToken ?? undefined,
    async (_userId, _limit, value) => {
      receivedCursor = value;
      return { items: [] };
    }
  );
  assert.deepEqual(receivedCursor, cursor);
  assert.deepEqual(second, { items: [], nextToken: null });
});

test("history service returns an empty page", async () => {
  const result = await getInterviewHistory(
    "jwt-user",
    20,
    undefined,
    async () => ({ items: [] })
  );
  assert.deepEqual(result, { items: [], nextToken: null });
});

test("history rejects a token belonging to another user", async () => {
  const token = Buffer.from(
    JSON.stringify({ userId: "other-user", interviewId: "cursor" })
  ).toString("base64url");
  await assert.rejects(
    getInterviewHistory("jwt-user", 20, token, async () => ({ items: [] })),
    InvalidHistoryRequestError
  );
});

test("DynamoDB query failures map to HISTORY_UNAVAILABLE", async () => {
  await assert.rejects(
    getInterviewHistory("jwt-user", 20, undefined, async () => {
      throw new Error("simulated DynamoDB failure");
    }),
    HistoryUnavailableError
  );

  const response = await requestHistory(async () => {
    throw new HistoryUnavailableError();
  });
  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    error: {
      code: "HISTORY_UNAVAILABLE",
      message: "Interview history is temporarily unavailable.",
    },
  });
});

test("invalid limits return 400 and excessive limits are capped", async () => {
  const invalid = await requestHistory(
    async () => ({ items: [], nextToken: null }),
    "?limit=invalid"
  );
  assert.equal(invalid.status, 400);

  let receivedLimit = 0;
  const capped = await requestHistory(
    async (_userId, limit) => {
      receivedLimit = limit;
      return { items: [], nextToken: null };
    },
    "?limit=500"
  );
  assert.equal(capped.status, 200);
  assert.equal(receivedLimit, 100);
});

test("history detail uses only the authenticated user's composite key", async () => {
  let receivedUserId = "";
  let receivedInterviewId = "";
  const response = await requestHistoryDetail(async (userId, interviewId) => {
    receivedUserId = userId;
    receivedInterviewId = interviewId;
    return fullResult(userId);
  });

  assert.equal(receivedUserId, "jwt-user");
  assert.equal(receivedInterviewId, validInterviewId);
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { result: fullResult() });
});

test("history detail does not return a record belonging to another user", async () => {
  await assert.rejects(
    getInterviewHistoryDetail(
      "jwt-user",
      validInterviewId,
      async () => fullResult("other-user")
    ),
    InterviewNotFoundError
  );
});

test("missing history detail returns INTERVIEW_NOT_FOUND", async () => {
  const response = await requestHistoryDetail(async () => {
    throw new InterviewNotFoundError();
  });
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    error: {
      code: "INTERVIEW_NOT_FOUND",
      message: "The interview result was not found.",
    },
  });
});

test("DynamoDB detail failure maps to HISTORY_UNAVAILABLE", async () => {
  await assert.rejects(
    getInterviewHistoryDetail("jwt-user", validInterviewId, async () => {
      throw new Error("simulated DynamoDB failure");
    }),
    HistoryUnavailableError
  );

  const response = await requestHistoryDetail(async () => {
    throw new HistoryUnavailableError();
  });
  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    error: {
      code: "HISTORY_UNAVAILABLE",
      message: "Interview history is temporarily unavailable.",
    },
  });
});

test("DynamoDB GetItem uses the authenticated composite key", () => {
  const request = buildInterviewResultGet("jwt-user", validInterviewId);
  assert.deepEqual(request.Key, {
    userId: "jwt-user",
    interviewId: validInterviewId,
  });
  assert.equal(request.ConsistentRead, false);
  assert.ok(!("ScanIndexForward" in request));
});

test("invalid interview ids return not found without a repository call", async () => {
  let called = false;
  await assert.rejects(
    getInterviewHistoryDetail("jwt-user", "invalid", async () => {
      called = true;
      return undefined;
    }),
    InterviewNotFoundError
  );
  assert.equal(called, false);
});

test("SAM grants only required DynamoDB data actions", () => {
  const template = readFileSync("../template.yaml", "utf8");
  assert.match(template, /dynamodb:GetItem/);
  assert.match(template, /dynamodb:PutItem/);
  assert.match(template, /dynamodb:Query/);
  assert.doesNotMatch(template, /dynamodb:Scan/);
  assert.match(
    template,
    /table\/\$\{InterviewsTableName\}/
  );
});
