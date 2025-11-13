import express from "express";

import { CONFIG } from "./config.js";
import { usersRouter } from "./users.js";
import { commentsRouter } from "./comments.js";
import { snippetsRouter } from "./snippets.js";

const app = express();
app.use(express.json());

app.use("/users", usersRouter);
app.use("/comments", commentsRouter);
app.use("/snippets", snippetsRouter);

app.listen(CONFIG.port, () => {
  console.log(`Server listening on http://localhost:${CONFIG.port}`)
});
