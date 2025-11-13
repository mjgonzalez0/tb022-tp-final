import { Router } from "express";
import { pool } from "./db.js";
import { hash } from "@node-rs/argon2";

const DATABASE_UNIQUE_CONSTRAINT_VIOLATION_CODE = "23505";

export const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  const { email, username, password, password_confirmation } = req.body;

  if (!email || !username || !password || !password_confirmation) {
    return res.status(400).json({
      error: "Todos los campos son requeridos",
    });
  }

  if (username.length < 3 || username.length > 60) {
    return res.status(422).json({
      error: "El usuario debe tener entre 3 y 60 caracteres",
    })
  }

  if (password !== password_confirmation) {
    return res.status(422).json({
      error: "Las contraseñas no coinciden"
    })
  }

  try {
    const passwordHash = await hash(password);
    const { rowCount } = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );

    if (rowCount !== 1) {
      return res.status(500).json({
        error: "No se pudo crear la cuenta"
      });
    }

    return res.sendStatus(201);
  } catch (e) {
    if (e instanceof Error && e.code === DATABASE_UNIQUE_CONSTRAINT_VIOLATION_CODE) {
      return res.status(409).json({
        error: "El usuario o email ya está en uso",
      });
    }

    return res.sendStatus(500);
  }
});
