import { pg } from "../db/postgres";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT = 10;

export async function register(data: any) {
  const { username, email, password } = data;

  const hash = await bcrypt.hash(password, SALT);

  const { rows } = await pg.query(
    `
    INSERT INTO users(username,email,password_hash)
    VALUES ($1,$2,$3)
    RETURNING id,username,email
    `,
    [username, email, hash]
  );

  const user = rows[0];

  await pg.query(
    `
    INSERT INTO user_state(
      user_id,current_difficulty,streak,max_streak,score,momentum,elo_rating,last_10_accuracy,mode
    )
    VALUES ($1,5,0,0,0,0,5,0.5,'simple')
    `,
    [user.id]
  );

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { token, user };
}

export async function login(data: any) {
  const { email, password } = data;

  const { rows } = await pg.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!rows.length) throw new Error("user not found");

  const user = rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) throw new Error("invalid password");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { token };
}
