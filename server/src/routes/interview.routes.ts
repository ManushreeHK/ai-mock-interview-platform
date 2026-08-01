import { Router } from "express";
import {
  generateInterview,
  evaluateInterview,
  getInterviewHistoryForCurrentUser,
  getInterviewHistoryDetailForCurrentUser,
} from "../controllers/interview.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/generate", authenticate, generateInterview);
router.post("/evaluate", authenticate, evaluateInterview);
router.get(
  "/history",
  authenticate,
  getInterviewHistoryForCurrentUser
);
router.get(
  "/history/:interviewId",
  authenticate,
  getInterviewHistoryDetailForCurrentUser
);

export default router;
