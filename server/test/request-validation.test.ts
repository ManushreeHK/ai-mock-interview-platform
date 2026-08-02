import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import {
  createEvaluateInterviewHandler,
  createGenerateInterviewHandler,
} from "../src/controllers/interview.controller.js";

async function post(
  path: string,
  handler: express.RequestHandler,
  body: unknown
) {
  const app = express();
  app.use(express.json());
  app.post(path, (req, _res, next) => {
    req.authenticatedUser = { sub: "user-1", username: "user", clientId: "client", scope: "", groups: [] };
    next();
  }, handler);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("generation rejects missing required fields without calling Gemini", async () => {
  let calls = 0;
  const response = await post("/generate", createGenerateInterviewHandler(async () => {
    calls += 1;
    return ["unreachable"];
  }), { role: "Developer" });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "INVALID_INTERVIEW_REQUEST");
  assert.equal(calls, 0);
});

test("evaluation rejects mismatched question and answer arrays before evaluation", async () => {
  let calls = 0;
  const response = await post("/evaluate", createEvaluateInterviewHandler(async () => {
    calls += 1;
    throw new Error("must not run");
  }, () => undefined), {
    type: "technical",
    role: "Developer",
    experience: "Junior",
    difficulty: "Easy",
    language: "TypeScript",
    questions: ["Question one", "Question two"],
    answers: ["Only one answer"],
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "INVALID_INTERVIEW_REQUEST");
  assert.equal(calls, 0);
});

test("generation accepts a complete payload and returns generated questions", async () => {
  const response = await post("/generate", createGenerateInterviewHandler(async (prompt) => {
    assert.match(prompt, /Role: Frontend Developer/);
    return ["What is React?"];
  }), {
    role: "Frontend Developer",
    experience: "3-5 Years",
    difficulty: "Medium",
    domain: "Web Development",
    language: "TypeScript",
    position: "Senior Frontend Developer",
  });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { success: true, questions: ["What is React?"] });
});
