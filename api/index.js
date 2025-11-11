import express from "express";
import { loadEnvFile } from "node:process";
import { usersRouter } from "./users.js";
import { commentsRouter } from "./comments.js";
import { snippetsRouter } from "./snippets.js";

loadEnvFile();

export const CONFIG = {
  port: process.env.PORT,
  database: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  }
};

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/comments", commentsRouter);
app.use("/snippets", snippetsRouter);

app.listen(CONFIG.port, () => {
  console.log(`Server listening on http://localhost:${CONFIG.port}`)
});
