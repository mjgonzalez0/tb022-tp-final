import { Router } from "express";
import { hash, verify } from "@node-rs/argon2";
import jwt from "jsonwebtoken";

import { pool } from "./db.js";
import { CONFIG } from "./config.js";

const DATABASE_UNIQUE_CONSTRAINT_VIOLATION_CODE = "23505";

export const usersRouter = Router();

usersRouter.post("/", guestMiddleware, async (req, res) => {
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

usersRouter.post("/login", guestMiddleware, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Todos los campos son requeridos",
    });
  }

  try {
    const { rows, rowCount } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rowCount === 0) {
      return res.status(400).json({
        error: "El email o la contraseña son invalidos"
      });
    }

    const user = rows.at(0);
    if (!await verify(user.password, password)) {
      return res.status(400).json({
        error: "El email o la contraseña son invalidos",
      });
    };

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#usage
    const accessToken = jwt.sign(payload, CONFIG.jwt.secret, {
      expiresIn: "7d",
      algorithm: "HS512",
    });

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      access_token: accessToken,
    });
  } catch (_) {
    return res.sendStatus(500);
  }
});

usersRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows, rowCount } = await pool.query(
      "SELECT id, username, email, bio, created_at, updated_at FROM users WHERE id = $1",
      [userId],
    );

    if (rowCount === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    const user = rows.at(0);
    return res.status(200).json({
      data: {
        ...user,
      },
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

function extractTokenFromRequest(req) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }

  return token;
}

export function authMiddleware(req, res, next) {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const jwtClaims = jwt.verify(token, CONFIG.jwt.secret);
    req.user = jwtClaims;
    return next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "Token de acceso expirado"
      });
    }

    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Token de acceso inválido"
      });
    }

    return res.sendStatus(500);
  }
}

export function guestMiddleware(req, res, next) {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, CONFIG.jwt.secret);
    return res.sendStatus(403); // sessión activa con token válido.
  } catch (_) {
    next();
  }
}
