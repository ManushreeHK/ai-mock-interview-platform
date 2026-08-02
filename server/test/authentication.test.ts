import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import express from "express";
import { JwtExpiredError } from "aws-jwt-verify/error";

process.env.GEMINI_API_KEY ||= "test-gemini-key";
process.env.COGNITO_USER_POOL_ID ||= "us-east-1_TestPool";
process.env.COGNITO_USER_POOL_CLIENT_ID ||= "test-client";
process.env.AWS_REGION ||= "us-east-1";
process.env.DYNAMODB_INTERVIEWS_TABLE ||= "test-interviews";

const { authenticate } = await import("../src/middleware/authenticate.js");
const { cognitoAccessTokenVerifier } = await import("../src/auth/cognito-verifier.js");

type Verify = typeof cognitoAccessTokenVerifier.verify;

async function requestWithVerifier(authorization: string | undefined, verify: Verify) {
  const originalVerify = cognitoAccessTokenVerifier.verify;
  cognitoAccessTokenVerifier.verify = verify;
  const app = express();
  app.get("/protected", authenticate, (req, res) => {
    res.json({ user: req.authenticatedUser });
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${port}/protected`, {
      headers: authorization ? { authorization } : {},
    });
    return { status: response.status, body: await response.json(), authenticate: response.headers.get("www-authenticate") };
  } finally {
    cognitoAccessTokenVerifier.verify = originalVerify;
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("authentication rejects malformed bearer headers before verification", async () => {
  let verifyCalls = 0;
  const response = await requestWithVerifier("Basic token", (async () => {
    verifyCalls += 1;
    throw new Error("must not run");
  }) as Verify);

  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "AUTH_TOKEN_INVALID");
  assert.equal(response.authenticate, "Bearer");
  assert.equal(verifyCalls, 0);
});

test("authentication maps verified Cognito claims onto the request user", async () => {
  const response = await requestWithVerifier("Bearer valid-token", (async (token: string) => {
    assert.equal(token, "valid-token");
    return {
      sub: "user-123",
      username: "candidate",
      client_id: "test-client",
      scope: "openid profile",
      "cognito:groups": ["users"],
    };
  }) as Verify);

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.user, {
    sub: "user-123",
    username: "candidate",
    clientId: "test-client",
    scope: "openid profile",
    groups: ["users"],
  });
});

test("authentication distinguishes expired tokens from other invalid tokens", async () => {
  const expired = await requestWithVerifier("Bearer expired", (async () => {
    throw new JwtExpiredError("Token expired", 1, "future");
  }) as Verify);
  assert.equal(expired.status, 401);
  assert.equal(expired.body.error.code, "AUTH_TOKEN_EXPIRED");

  const invalid = await requestWithVerifier("Bearer invalid", (async () => {
    throw new Error("invalid signature");
  }) as Verify);
  assert.equal(invalid.status, 401);
  assert.equal(invalid.body.error.code, "AUTH_TOKEN_INVALID");
});
