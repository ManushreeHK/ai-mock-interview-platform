import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const workspaceRoot = resolve(import.meta.dirname, "../..");
const builtTemplatePath = resolve(workspaceRoot, ".aws-sam/build/template.yaml");
const functionDirectory = resolve(workspaceRoot, ".aws-sam/build/InterviewAceFunction");

if (!existsSync(builtTemplatePath)) {
  throw new Error(`SAM build template does not exist: ${builtTemplatePath}`);
}

const builtTemplate = readFileSync(builtTemplatePath, "utf8");
const functionBlock = builtTemplate.match(/InterviewAceFunction:\s*[\s\S]*?(?=\n  [A-Za-z][A-Za-z0-9]+:|\nOutputs:|$)/)?.[0];
const handler = functionBlock?.match(/^\s+Handler:\s*([^\s]+)\s*$/m)?.[1];

if (!handler || !handler.includes(".")) {
  throw new Error("InterviewAceFunction has no valid built Handler value.");
}

const modulePath = handler.slice(0, handler.lastIndexOf("."));
const exportName = handler.slice(handler.lastIndexOf(".") + 1);
const artifactPath = resolve(functionDirectory, `${modulePath}.js`);

if (!existsSync(artifactPath)) {
  throw new Error(`Built Lambda handler module does not exist: ${artifactPath}`);
}

const artifactUrl = pathToFileURL(artifactPath);
artifactUrl.searchParams.set("handler-verification", String(Date.now()));
const artifact = await import(artifactUrl.href);
const namedHandler = artifact[exportName] ?? artifact.default?.[exportName];

if (typeof namedHandler !== "function") {
  throw new Error(`Built Lambda module does not export a function named ${exportName}.`);
}

console.log(`Verified ${handler} at ${artifactPath}`);
