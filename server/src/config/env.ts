import "dotenv/config";

type ServerEnv = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  geminiApiKey: string;
  geminiPrimaryModel: string;
  geminiFallbackModel: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
  awsRegion: string;
  interviewsTableName: string;
  frontendOrigins: readonly string[];
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

function readPort(): number {
  const rawPort = process.env.PORT?.trim() || "5000";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function readNodeEnv(): ServerEnv["nodeEnv"] {
  const value = process.env.NODE_ENV?.trim() || "development";

  if (
    value !== "development" &&
    value !== "test" &&
    value !== "production"
  ) {
    throw new Error(
      "NODE_ENV must be development, test, or production."
    );
  }

  return value;
}

function normalizeOrigin(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "FRONTEND_URLS must contain valid absolute URLs."
    );
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "FRONTEND_URLS entries must be HTTP(S) origins without paths."
    );
  }

  return url.origin;
}

function readFrontendOrigins(
  nodeEnv: ServerEnv["nodeEnv"]
): readonly string[] {
  const configuredOrigins = (process.env.FRONTEND_URLS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeOrigin);
  const origins =
    nodeEnv === "development"
      ? ["http://localhost:5173", ...configuredOrigins]
      : configuredOrigins;
  const uniqueOrigins = [...new Set(origins)];

  if (nodeEnv === "production" && uniqueOrigins.length === 0) {
    throw new Error(
      "Missing required environment variable: FRONTEND_URLS"
    );
  }

  return Object.freeze(uniqueOrigins);
}

const nodeEnv = readNodeEnv();

export const env: ServerEnv = Object.freeze({
  nodeEnv,
  port: readPort(),
  geminiApiKey: requireEnv("GEMINI_API_KEY"),
  geminiPrimaryModel: optionalEnv(
    "GEMINI_PRIMARY_MODEL",
    "gemini-3.5-flash"
  ),
  geminiFallbackModel: optionalEnv(
    "GEMINI_FALLBACK_MODEL",
    "gemini-3.5-flash-lite"
  ),
  cognitoUserPoolId: requireEnv("COGNITO_USER_POOL_ID"),
  cognitoUserPoolClientId: requireEnv(
    "COGNITO_USER_POOL_CLIENT_ID"
  ),
  awsRegion: requireEnv("AWS_REGION"),
  interviewsTableName: requireEnv(
    "DYNAMODB_INTERVIEWS_TABLE"
  ),
  frontendOrigins: readFrontendOrigins(nodeEnv),
});
