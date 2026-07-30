import { Router } from "express";
import {
  generateInterview,
  evaluateInterview,
} from "../controllers/interview.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/generate", authenticate, generateInterview);
router.post("/evaluate", authenticate, evaluateInterview);

export default router;
