import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
console.log("host: ", process.env.REDIS_HOST);
// console.log()
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

export async function testRedis() {
  await redis.set("ping", "pong");
  return await redis.get("ping");
}
