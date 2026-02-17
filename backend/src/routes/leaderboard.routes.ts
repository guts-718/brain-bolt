import { Router } from "express";
import * as leaderboardService from "../services/leaderboard.service";

const router = Router();

router.get("/score", async (_, res) => {
  res.json(await leaderboardService.getScoreLeaderboard());
});

router.get("/streak", async (_, res) => {
  res.json(await leaderboardService.getStreakLeaderboard());
});

export default router;
