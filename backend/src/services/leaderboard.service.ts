import { redis } from "../redis/client";
import { pg } from "../db/postgres";

export async function getScoreLeaderboard() {
  const raw = await redis.zrevrange("leaderboard:score", 0, 9, "WITHSCORES");

  if (raw.length) return await attachUsernames(raw);

  // fallback → db snapshot
  const { rows } = await pg.query(`
    SELECT u.username, s.score AS value
    FROM leaderboard_snapshots s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.score DESC
    LIMIT 10
  `);

  return rows;
}

export async function getStreakLeaderboard() {
  const raw = await redis.zrevrange("leaderboard:streak", 0, 9, "WITHSCORES");

  if (raw.length) return await attachUsernames(raw);

  const { rows } = await pg.query(`
    SELECT u.username, s.max_streak AS value
    FROM leaderboard_snapshots s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.max_streak DESC
    LIMIT 10
  `);

  return rows;
}


async function attachUsernames(arr: string[]) {
  const ids: string[] = [];
  const scores: Record<string, number> = {};

  for (let i = 0; i < arr.length; i += 2) {
    const id = arr[i];
    ids.push(id);
    scores[id] = Number(arr[i + 1]);
  }

  const { rows } = await pg.query(
    `SELECT id, username FROM users WHERE id = ANY($1)`,
    [ids]
  );

  const map = new Map(rows.map(r => [r.id, r.username]));

  return ids.map(id => ({
    username: map.get(id) ?? "Unknown",
    value: scores[id]
  }));
}
