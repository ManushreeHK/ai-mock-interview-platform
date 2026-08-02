import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("SAM esbuild configuration targets the root lambda handler artifact", () => {
  const template = readFileSync("../template.yaml", "utf8");
  const entry = readFileSync("src/lambda.ts", "utf8");

  assert.match(template, /Handler: lambda\.handler/);
  assert.match(template, /BuildMethod: esbuild/);
  assert.match(template, /- src\/lambda\.ts/);
  assert.match(template, /Format: cjs/);
  assert.match(entry, /export async function handler\(/);
});
