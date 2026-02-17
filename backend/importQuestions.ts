import fs from "fs";
import path from "path";
import { pg } from "./src/db/postgres";

async function run(){

  const filePath = path.join(__dirname,"questions.json");
  const raw = fs.readFileSync(filePath,"utf-8");
  const questions = JSON.parse(raw);

  console.log("Importing",questions.length,"questions...");

  for(const q of questions){

    await pg.query(
      `
      INSERT INTO questions
      (text,options,correct_option,difficulty,topic)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        q.text,
        JSON.stringify(q.options),
        q.correct_option,
        q.difficulty,
        q.topic
      ]
    );

  }

  console.log("Done");
  process.exit();
}

run();
