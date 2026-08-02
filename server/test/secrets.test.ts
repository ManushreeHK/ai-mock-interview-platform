import assert from "node:assert/strict";
import test from "node:test";
import { parseGeminiSecret } from "../src/lambda.js";

test("Secrets Manager payload returns a trimmed Gemini API key", () => {
  assert.equal(parseGeminiSecret('{"GEMINI_API_KEY":"  secret-key  "}'), "secret-key");
});

for (const [label, value, message] of [
  ["missing SecretString", undefined, "Gemini secret has no SecretString value."],
  ["invalid JSON", "not-json", "Gemini secret must be a JSON object."],
  ["JSON array", "[]", "Gemini secret is missing GEMINI_API_KEY."],
  ["missing key", "{}", "Gemini secret is missing GEMINI_API_KEY."],
  ["blank key", '{"GEMINI_API_KEY":"   "}', "Gemini secret is missing GEMINI_API_KEY."],
] as const) {
  test(`Secrets Manager rejects ${label}`, () => {
    assert.throws(() => parseGeminiSecret(value), new RegExp(message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
}
