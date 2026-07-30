import type { RequestHandler, Response } from "express";
import { JwtExpiredError } from "aws-jwt-verify/error";
import { cognitoAccessTokenVerifier } from "../auth/cognito-verifier.js";

type AuthenticationErrorCode =
  | "AUTH_TOKEN_MISSING"
  | "AUTH_TOKEN_INVALID"
  | "AUTH_TOKEN_EXPIRED";

function sendUnauthorized(
  res: Response,
  code: AuthenticationErrorCode,
  message: string
) {
  res.setHeader("WWW-Authenticate", "Bearer");

  return res.status(401).json({
    success: false,
    error: {
      code,
      message,
    },
  });
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization?.trim()) {
    sendUnauthorized(
      res,
      "AUTH_TOKEN_MISSING",
      "Authentication is required."
    );
    return;
  }

  const parts = authorization.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    !parts[1]
  ) {
    sendUnauthorized(
      res,
      "AUTH_TOKEN_INVALID",
      "The access token is invalid."
    );
    return;
  }

  try {
    const payload = await cognitoAccessTokenVerifier.verify(parts[1]);

    req.authenticatedUser = {
      sub: payload.sub,
      username: payload.username,
      clientId: payload.client_id,
      scope: payload.scope,
      groups: payload["cognito:groups"] ?? [],
    };

    next();
  } catch (error) {
    if (error instanceof JwtExpiredError) {
      sendUnauthorized(
        res,
        "AUTH_TOKEN_EXPIRED",
        "The access token has expired."
      );
      return;
    }

    sendUnauthorized(
      res,
      "AUTH_TOKEN_INVALID",
      "The access token is invalid."
    );
  }
};
