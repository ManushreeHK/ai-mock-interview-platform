import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import interviewRoutes from "./routes/interview.routes.js";
import { env } from "./config/env.js";

const app = express();

const allowedOrigins = new Set(env.frontendOrigins);

class CorsOriginError extends Error {}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      let normalizedOrigin: string;

      try {
        normalizedOrigin = new URL(origin).origin;
      } catch {
        callback(new CorsOriginError());
        return;
      }

      if (allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new CorsOriginError());
    },
  })
);
app.use(express.json());
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/interview", interviewRoutes);
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Welcome to InterviewAce AI API 🚀",
  });
});

const handleCorsError: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (error instanceof CorsOriginError) {
    res.status(403).json({
      success: false,
      error: {
        code: "CORS_ORIGIN_FORBIDDEN",
        message: "The request origin is not allowed.",
      },
    });
    return;
  }

  next(error);
};

app.use(handleCorsError);

export default app;
