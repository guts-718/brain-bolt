import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testPG } from "./db/postgres";
import { testRedis } from "./redis/client";
import authRoutes from "./routes/auth.routes";
import quizRoutes from "./routes/quiz.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";


dotenv.config({ path: "../.env" });
console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});


console.log("port: ", process.env.PORT);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/infra-test", async (_, res) => {
  try {
    const pg = await testPG();
    const redis = await testRedis();

    res.json({
      postgres: pg,
      redis,
      status: "all good",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "infra failed" });
  }
});

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/leaderboard", leaderboardRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
