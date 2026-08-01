import { configure as serverlessExpress } from "@codegenie/serverless-express";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

type ExpressProxy = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

let expressProxy: ExpressProxy | undefined;
let secretLoad: Promise<void> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function loadGeminiSecret() {
  if (process.env.GEMINI_API_KEY?.trim()) return;

  const secretId = process.env.GEMINI_SECRET_ID?.trim();
  if (!secretId) {
    throw new Error("Missing required environment variable: GEMINI_SECRET_ID");
  }

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );
  if (!response.SecretString) {
    throw new Error("Gemini secret has no SecretString value.");
  }

  let secret: unknown;
  try {
    secret = JSON.parse(response.SecretString) as unknown;
  } catch {
    throw new Error("Gemini secret must be a JSON object.");
  }

  if (
    !isRecord(secret) ||
    typeof secret.GEMINI_API_KEY !== "string" ||
    !secret.GEMINI_API_KEY.trim()
  ) {
    throw new Error("Gemini secret is missing GEMINI_API_KEY.");
  }

  process.env.GEMINI_API_KEY = secret.GEMINI_API_KEY.trim();
}

async function getExpressProxy() {
  if (!expressProxy) {
    secretLoad ??= loadGeminiSecret();
    await secretLoad;
    const { default: app } = await import("./app.js");
    expressProxy = serverlessExpress({ app }) as unknown as ExpressProxy;
  }

  return expressProxy;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
) {
  const proxy = await getExpressProxy();
  return proxy(event, context);
}
