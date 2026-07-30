import "dotenv/config";

type ServerEnv = {
  port: number;
  geminiApiKey: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function readPort(): number {
  const rawPort = process.env.PORT?.trim() || "5000";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

export const env: ServerEnv = Object.freeze({
  port: readPort(),
  geminiApiKey: requireEnv("GEMINI_API_KEY"),
});
