import { Router } from "express";
import { authMiddleware, AuthedRequest } from "../middleware/auth.middleware";
import * as quizService from "../services/quiz.service";

const router = Router();

router.get("/next", authMiddleware, async (req: AuthedRequest, res) => {
  const data = await quizService.getNextQuestion(req.userId!);
  res.json(data);
});

router.post("/answer", authMiddleware, async (req: AuthedRequest, res) => {
  const data = await quizService.submitAnswer(req.userId!, req.body);
  res.json(data);
});

router.post("/answer", authMiddleware, async (req: AuthedRequest, res) => {
  const data = await quizService.submitAnswer(req.userId!, req.body);
  res.json(data);
});


router.get("/state", authMiddleware, async (req: AuthedRequest, res) => {
  const data = await quizService.getState(req.userId!);
  res.json(data);
});

export default router;
