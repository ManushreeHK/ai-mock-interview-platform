import { CognitoJwtVerifier } from "aws-jwt-verify";
import { env } from "../config/env.js";

export const cognitoAccessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: env.cognitoUserPoolId,
  clientId: env.cognitoUserPoolClientId,
  tokenUse: "access",
});
