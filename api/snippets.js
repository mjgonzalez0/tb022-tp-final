import { Router } from "express";
import { authMiddleware, getCurrentUser } from "./users.js";
import { pool } from "./db.js";

export const snippetsRouter = Router();

snippetsRouter.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { title, visibility: is_public, code, runtime } = req.body;

  if (!title || !code || !runtime) {
    return res.status(400).json({
      message: "Todos los campos son requeridos",
    });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO snippets (title, code, is_public, runtime, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, code, Boolean(is_public), runtime, userId],
    );

    if (rows.length !== 1) {
      return res.status(500).json({
        message: "No se pudo crear el snippet",
      });
    }

    const snippetId = rows.at(0).id;
    return res.status(201).json({
      message: "Snippet creado",
      data: {
        id: snippetId,
      },
    });
  } catch (_) {
    res.sendStatus(500);
  }
});

snippetsRouter.put("/:snippetId", authMiddleware, async (req, res) => {
  const snippetId = getSnippetIdFromReq(req);
  if (!snippetId) {
    return res.status(400).json({
      message: "Snippet id inválido",
      data: {
        id: req.params.snippetId,
      },
    });
  }

  const { title, visibility: is_public, code, runtime } = req.body;
  if (!title || !code || !runtime) {
    return res.status(400).json({
      message: "Todos los campos son requeridos",
    });
  }

  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      `UPDATE snippets
       SET title = $1, is_public = $2, code = $3, runtime = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, Boolean(is_public), code, runtime, snippetId, userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Snippet no encontrado o no tienes permisos",
      });
    }

    return res.json({
      data: rows.at(0),
    });
  } catch (e) {
    return res.sendStatus(500);
  }
});

snippetsRouter.delete("/:snippetId", authMiddleware, async (req, res) => {
  const snippetId = getSnippetIdFromReq(req);
  if (!snippetId) {
    return res.status(400).json({
      message: "Snippet id invalido",
      data: {
        id: req.params.snippetId,
      },
    });
  }

  const userId = req.user.id;
  try {
    await pool.query("DELETE FROM snippets WHERE id = $1 AND user_id = $2", [
      snippetId,
      userId,
    ]);

    return res.sendStatus(204);
  } catch (_) {
    return res.sendStatus(500);
  }
});

snippetsRouter.get("/", async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        s.id,
        s.title,
        s.code,
        s.upvotes,
        s.runtime,
        s.user_id,
        s.created_at,
        s.updated_at,
        u.username
      FROM snippets s INNER JOIN users u ON s.user_id = u.id WHERE s.is_public = true`,
    );

    return res.json({
      data: rows,
    });
  } catch (_) {
    return res.sendStatus(500);
  }
});

snippetsRouter.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        title,
        code,
        is_public,
        upvotes,
        runtime,
        created_at,
        updated_at
      FROM snippets WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );

    return res.json({
      data: rows,
    });
  } catch (_) {
    return res.sendStatus(500);
  }
});

snippetsRouter.get("/:snippetId", async (req, res) => {
  const user = getCurrentUser(req);
  const snippetId = getSnippetIdFromReq(req);
  if (!snippetId) {
    return res.status(404).json({
      message: "Snippet no encontrado",
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        s.id,
        s.title,
        s.code,
        s.upvotes,
        s.runtime,
        s.user_id,
        s.is_public,
        s.created_at,
        s.updated_at,
        u.username
      FROM snippets s INNER JOIN users u ON s.user_id = u.id WHERE s.id = $1`,
      [snippetId],
    );

    if (rows.length !== 1) {
      return res.status(404).json({
        message: "Snippet no encontrado",
      });
    }
    
    const snippet = rows.at(0);
    
    const isOwner = user && snippet.user_id === user.id;
    if (!snippet.is_public && !isOwner) {
      console.log(`Acceso denegado: usuario ${user.id} intento acceder al snippet ${snippet.id}`);
      return res.status(404).json({ message: "Snippet no encontrado" });
    }

    return res.json({
      data: snippet,
    });
  } catch (_) {
    return res.sendStatus(500);
  }
});

export function getSnippetIdFromReq(req) {
  const snippetId = Number.parseInt(req.params.snippetId);
  if (Number.isNaN(snippetId)) {
    return null;
  }
  return snippetId;
}
