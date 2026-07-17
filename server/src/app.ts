import express from "express";
import cors from "cors";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/interview", interviewRoutes);
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Welcome to InterviewAce AI API 🚀",
  });
});

export default app;