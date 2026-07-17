import { Router } from "express";
import { generateInterview } from "../controllers/interview.controller.js";

const router = Router();

router.post("/generate", generateInterview);

export default router;