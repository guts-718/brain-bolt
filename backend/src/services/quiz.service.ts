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

// ACCURACY 

async function getLast10Accuracy(userId: string) {
  const { rows } = await pg.query(
    `
    SELECT is_correct
    FROM answers
    WHERE user_id=$1
    ORDER BY answered_at DESC
    LIMIT 10
    `,
    [userId]
  );

  if (!rows.length) return 0.5;

  const correct = rows.filter(r => r.is_correct).length;
  return correct / rows.length;
}

// QUESTION FETCH 

async function getQuestion(diff: number, userId: string) {
  const cacheKey = `questions:diff:${diff}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    const list = JSON.parse(cached);
    return list[Math.floor(Math.random() * list.length)];
  }

  const { rows } = await pg.query(
    `
    SELECT *
    FROM questions
    WHERE difficulty BETWEEN $1 AND $2
    AND id NOT IN (
      SELECT question_id
      FROM answers
      WHERE user_id=$3
      ORDER BY answered_at DESC
      LIMIT 20
    )
    `,
    [diff - 1, diff + 1, userId]
  );

  if (!rows.length) {
    const fallback = await pg.query(
      "SELECT * FROM questions ORDER BY RANDOM() LIMIT 1"
    );
    return fallback.rows[0];
  }

  await redis.set(cacheKey, JSON.stringify(rows), "EX", 600);

  return rows[Math.floor(Math.random() * rows.length)];
}

// NEXT QUESTION 
export async function getNextQuestion(userId: string) {
  console.log("userid: ",userId);
  const state = await getUserState(userId);
  console.log("State: ",state);
  const q = await getQuestion(state.current_difficulty, userId);
  console.log("q: ",q);

  return {
    question_id: q?.id,
    text: q?.text,
    options: q?.options,
    difficulty: q?.difficulty,
    topic: q?.topic,
    media_url: q?.media_url
  };
}

// ANSWER SUBMISSION 

export async function submitAnswer(userId: string, body: any) {
  const { question_id, selected_option, time_taken_ms, idempotency_key } =
    body;

  // IDEMPOTENCY 

  const cached = await redis.get(idempotency_key);
  if (cached) return JSON.parse(cached);

  const client = await pg.connect();

  try {
    await client.query("BEGIN");

    // LOAD STATE + QUESTION 

    const stateRes = await client.query(
      "SELECT * FROM user_state WHERE user_id=$1 FOR UPDATE",
      [userId]
    );
    const state = stateRes.rows[0];

    const qRes = await client.query(
      "SELECT * FROM questions WHERE id=$1",
      [question_id]
    );
    const question = qRes.rows[0];

    const correct = question.correct_option === selected_option;

    // UPDATE STREAK 
    let streak = correct ? state.streak + 1 : 0;

    // ACCURACY 

    const accuracy = await getLast10Accuracy(userId);

    // DIFFICULTY 

    let difficulty = state.current_difficulty;
    let momentum = state.momentum;
    let rating = state.elo_rating;

    if (state.mode === "simple") {
      const res = updateDifficultySimple(difficulty, momentum, correct);
      difficulty = res.difficulty;
      momentum = res.momentum;
    } else {
      rating = updateElo(rating, question.difficulty, correct);
      difficulty = Math.round(rating);
    }

    // SCORE 

    const raw = calculateScore(question.difficulty, streak, accuracy);

    const delta = correct ? Math.max(0, raw) : 0;

    const newScore = state.score + delta;


    // INSERT ANSWER

    await client.query(
      `
      INSERT INTO answers
      (user_id,question_id,selected_option,is_correct,difficulty,time_taken_ms)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [userId, question_id, selected_option, correct, question.difficulty, time_taken_ms]
    );

    // UPDATE STATE 
    await client.query(
      `
      UPDATE user_state
      SET current_difficulty=$1,
          momentum=$2,
          elo_rating=$3,
          streak=$4,
          score=$5,
          last_10_accuracy=$6,
          last_answered_at=now()
      WHERE user_id=$7
      `,
      [difficulty, momentum, rating, streak, newScore, accuracy, userId]
    );

    await client.query("COMMIT");

    // LEADERBOARD 

    await redis.zadd("leaderboard:score", newScore, userId);
    await redis.zadd("leaderboard:streak", streak, userId);

    // RESPONSE 

    const result = {
      correct,
      correct_option: question.correct_option,
      new_score: newScore,
      streak,
      difficulty
    };

    await redis.set(idempotency_key, JSON.stringify(result), "EX", 3600);

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// STATE 

export async function getState(userId: string) {
  return getUserState(userId);
}
