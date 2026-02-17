import { pg } from "../db/postgres";
import { redis } from "../redis/client";
import { calculateScore } from "./score.service";
import { updateDifficultySimple, updateElo } from "./adaptive.service";

async function getUserState(userId: string) {
  const { rows } = await pg.query(
    "SELECT * FROM user_state WHERE user_id=$1",
    [userId]
  );
  return rows[0];
}

async function getQuestion(diff: number, userId: string) {
  const { rows } = await pg.query(
    `
    SELECT *
    FROM questions
    WHERE difficulty BETWEEN $1 AND $2
    ORDER BY RANDOM()
    LIMIT 1
  `,
    [diff - 1, diff + 1]
  );

  return rows[0];
}

export async function getNextQuestion(userId: string) {
  console.log("user id: ",userId);
  const state = await getUserState(userId);
  console.log("state : ", state);

  const q = await getQuestion(state.current_difficulty, userId);

  return q;
}

export async function submitAnswer(userId: string, body: any) {
  const { question_id, selected_option, time_taken_ms, idempotency_key } =
    body;

  const cached = await redis.get(idempotency_key);
  if (cached) return JSON.parse(cached);

  const state = await getUserState(userId);

  const qRes = await pg.query(
    "SELECT * FROM questions WHERE id=$1",
    [question_id]
  );
  const question = qRes.rows[0];

  const correct = question.correct_option === selected_option;

  let difficulty = state.current_difficulty;
  let momentum = state.momentum;
  let rating = state.elo_rating;
  let streak = correct ? state.streak + 1 : 0;

  if (state.mode === "simple") {
    const res = updateDifficultySimple(difficulty, momentum, correct);
    difficulty = res.difficulty;
    momentum = res.momentum;
  } else {
    rating = updateElo(rating, question.difficulty, correct);
    difficulty = Math.round(rating);
  }

  const scoreDelta = calculateScore(
    question.difficulty,
    streak,
    state.last_10_accuracy || 0
  );

  const newScore = state.score + scoreDelta;

  await pg.query(
    `
    INSERT INTO answers(user_id,question_id,selected_option,is_correct,difficulty,time_taken_ms)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [userId, question_id, selected_option, correct, question.difficulty, time_taken_ms]
  );

  await pg.query(
    `
    UPDATE user_state
    SET current_difficulty=$1,
        momentum=$2,
        elo_rating=$3,
        streak=$4,
        score=$5,
        last_answered_at=now()
    WHERE user_id=$6
    `,
    [difficulty, momentum, rating, streak, newScore, userId]
  );

  await redis.zadd("leaderboard:score", newScore, userId);
  await redis.zadd("leaderboard:streak", streak, userId);

  const result = {
    correct,
    correct_option: question.correct_option,
    new_score: newScore,
    streak,
    difficulty
  };

  await redis.set(idempotency_key, JSON.stringify(result), "EX", 3600);

  return result;
}

export async function getState(userId: string) {
  return getUserState(userId);
}
