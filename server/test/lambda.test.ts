import assert from "node:assert/strict";
import test from "node:test";
import type {
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";

process.env.GEMINI_API_KEY ||= "test-gemini-key";
process.env.NODE_ENV = "production";
process.env.FRONTEND_URLS =
  "https://main.d1aqwxz5mscjq8.amplifyapp.com";

const { handler } = await import("../src/lambda.js");

function event(
  method: string,
  path: string,
  headers: Record<string, string> = {},
  body: string | null = null
): APIGatewayProxyEvent {
  return {
    body,
    headers,
    multiValueHeaders: Object.fromEntries(
      Object.entries(headers).map(([name, value]) => [name, [value]])
    ),
    httpMethod: method,
    isBase64Encoded: false,
    path,
    pathParameters: { proxy: path.replace(/^\//, "") },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    resource: "/{proxy+}",
    stageVariables: null,
    requestContext: {
      accountId: "test",
      apiId: "test",
      authorizer: null,
      protocol: "HTTP/1.1",
      httpMethod: method,
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: "127.0.0.1",
        user: null,
        userAgent: "node-test",
        userArn: null,
      },
      path,
      requestId: "test-request",
      requestTimeEpoch: Date.now(),
      resourceId: "test-resource",
      resourcePath: "/{proxy+}",
      stage: "prod",
    },
  };
}

const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "interviewace-api",
  functionVersion: "$LATEST",
  invokedFunctionArn: "arn:aws:lambda:ap-south-1:000000000000:function:test",
  memoryLimitInMB: "1024",
  awsRequestId: "test-request",
  logGroupName: "/aws/lambda/interviewace-api",
  logStreamName: "test",
  getRemainingTimeInMillis: () => 60_000,
  done: () => undefined,
  fail: () => undefined,
  succeed: () => undefined,
};

test("Lambda adapter serves Express health through a REST proxy event", async () => {
  const response = await handler(event("GET", "/health"), context);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { status: "ok" });
});

test("Lambda adapter preserves Express CORS preflight behavior", async () => {
  const response = await handler(
    event("OPTIONS", "/api/interview/generate", {
      Origin: "https://main.d1aqwxz5mscjq8.amplifyapp.com",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "authorization,content-type",
    }),
    context
  );
  assert.equal(response.statusCode, 204);
  const allowOrigin = Object.entries(response.headers ?? {}).find(
    ([name]) => name.toLowerCase() === "access-control-allow-origin"
  )?.[1] ?? Object.entries(response.multiValueHeaders ?? {}).find(
    ([name]) => name.toLowerCase() === "access-control-allow-origin"
  )?.[1]?.[0];
  assert.equal(
    allowOrigin,
    "https://main.d1aqwxz5mscjq8.amplifyapp.com"
  );
});

for (const [method, path] of [
  ["POST", "/api/interview/generate"],
  ["POST", "/api/interview/evaluate"],
  ["GET", "/api/interview/history"],
] as const) {
  test(`Lambda adapter protects ${method} ${path}`, async () => {
    const response = await handler(event(method, path), context);
    assert.equal(response.statusCode, 401);
    assert.equal(
      JSON.parse(response.body).error.code,
      "AUTH_TOKEN_MISSING"
    );
  });
}
