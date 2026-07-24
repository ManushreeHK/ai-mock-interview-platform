import { Router } from "express";
import {
  generateInterview,
  evaluateInterview,
} from "../controllers/interview.controller.js";

const router = Router();

router.post("/generate", generateInterview);
router.post("/evaluate", evaluateInterview);

export default router;