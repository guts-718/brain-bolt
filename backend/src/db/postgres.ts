import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
console.log("host: ", process.env.REDIS_HOST);
console.log("password: ", process.env.DB_PASS);
export const pg = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export async function testPG() {
  const res = await pg.query("SELECT NOW()");
  return res.rows[0];
}
