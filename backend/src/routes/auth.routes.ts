import { Router } from "express";
import * as authService from "../services/auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  const data = await authService.register(req.body);
  res.json(data);
});

router.post("/login", async (req, res) => {
  const data = await authService.login(req.body);
  res.json(data);
});

export default router;
