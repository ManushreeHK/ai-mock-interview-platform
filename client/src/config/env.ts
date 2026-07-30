type ClientEnv = {
  apiBaseUrl: string;
  awsRegion: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
  cognitoDomain: string;
  oauthRedirectSignIn: readonly string[];
  oauthRedirectSignOut: readonly string[];
};

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function requireUrlList(
  name: keyof ImportMetaEnv
): readonly string[] {
  const values = requireEnv(name)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.length === 0) {
    throw new Error(
      `Environment variable ${name} must contain at least one URL.`
    );
  }

  for (const value of values) {
    let url: URL;

    try {
      url = new URL(value);
    } catch {
      throw new Error(
        `Environment variable ${name} contains an invalid URL.`
      );
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(
        `Environment variable ${name} must contain HTTP(S) URLs.`
      );
    }
  }

  return Object.freeze(values);
}

const cognitoUserPoolId = requireEnv(
  "VITE_COGNITO_USER_POOL_ID"
);
const poolRegion = cognitoUserPoolId.split("_", 1)[0];
const configuredRegion = import.meta.env.VITE_AWS_REGION;
const awsRegion =
  typeof configuredRegion === "string" && configuredRegion.trim()
    ? configuredRegion.trim()
    : poolRegion;

if (!poolRegion || !cognitoUserPoolId.startsWith(`${awsRegion}_`)) {
  throw new Error(
    "VITE_COGNITO_USER_POOL_ID must belong to VITE_AWS_REGION."
  );
}

export const env: ClientEnv = Object.freeze({
  apiBaseUrl: requireEnv("VITE_API_BASE_URL"),
  awsRegion,
  cognitoUserPoolId,
  cognitoUserPoolClientId: requireEnv(
    "VITE_COGNITO_USER_POOL_CLIENT_ID"
  ),
  cognitoDomain: requireEnv("VITE_COGNITO_DOMAIN"),
  oauthRedirectSignIn: requireUrlList(
    "VITE_OAUTH_REDIRECT_SIGN_IN"
  ),
  oauthRedirectSignOut: requireUrlList(
    "VITE_OAUTH_REDIRECT_SIGN_OUT"
  ),
});
