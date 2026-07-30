type ClientEnv = {
  apiBaseUrl: string;
  cognitoUserPoolId: string;
  cognitoUserPoolClientId: string;
};

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export const env: ClientEnv = Object.freeze({
  apiBaseUrl: requireEnv("VITE_API_BASE_URL"),
  cognitoUserPoolId: requireEnv("VITE_COGNITO_USER_POOL_ID"),
  cognitoUserPoolClientId: requireEnv(
    "VITE_COGNITO_USER_POOL_CLIENT_ID"
  ),
});
