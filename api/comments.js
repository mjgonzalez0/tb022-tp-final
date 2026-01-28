import { Router } from "express";
import { authMiddleware } from "./users.js";
import { getSnippetIdFromReq } from "./snippets.js";
import { pool } from "./db.js";

export const commentsRouter = Router();

commentsRouter.post(
  "/snippets/:snippetId/comments",
  authMiddleware,
  async (req, res) => {
    const { content } = req.body;
    if (typeof content !== "string" || content.length === 0) {
      return res.status(400).json({
        message: "Todos los campos son requeridos",
      });
    }

    const userId = req.user.id;
    const snippetId = getSnippetIdFromReq(req);
    if (!snippetId || !(await isSnippetPublic(snippetId))) {
      return res.status(404).json({
        message: "Snippet no encontrado",
      });
    }

    try {
      const { rows: comments } = await pool.query(
        "INSERT INTO comments (content, user_id, snippet_id) VALUES ($1, $2, $3) RETURNING id",
        [content, userId, snippetId],
      );

      if (comments.length === 0) {
        return res.status(500).json({
          message: "No se pudo crear el comentario",
        });
      }

      return res.status(201).json({
        message: "Comentario creado",
        data: {
          id: comments.at(0).id,
        },
      });
    } catch (_) {
      return res.sendStatus(500);
    }
  },
);

commentsRouter.get("/snippets/:snippetId/comments", async (req, res) => {
  const snippetId = getSnippetIdFromReq(req);
  if (!snippetId || !(await isSnippetPublic(snippetId))) {
    return res.status(404).json({
      message: "Snippet no encontrado",
    });
  }

  try {
    const { rows: comments } = await pool.query(
      `
      SELECT
        c.id,
        c.content,
        c.upvotes,
        c.snippet_id,
        c.created_at,
        c.updated_at,
        u.username,
        u.id as user_id
      FROM comments c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.snippet_id = $1
      ORDER BY c.created_at DESC
      `,
      [snippetId],
    );

    return res.json({
      data: comments,
    });
  } catch (_) {
    return res.sendStatus(500);
  }
});

commentsRouter.delete(
  "/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const commentId = getCommentId(req);
    if (!commentId) {
      return res.status(404).json({
        message: "Comentario no encontrado",
      });
    }

    const userId = req.user.id;
    try {
      await pool.query("DELETE FROM comments WHERE id = $1 AND user_id = $2", [
        commentId,
        userId,
      ]);

      return res.sendStatus(204);
    } catch (_) {
      return res.sendStatus(500);
    }
  },
);

commentsRouter.put("/comments/:commentId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const commentId = getCommentId(req);

  if (!commentId || !(await commentExists(commentId, userId))) {
    return res.status(404).json({
      message: "Comentario no encontrado",
    });
  }

  const { content } = req.body;
  if (typeof content !== "string" || content.length === 0) {
    return res.status(400).json({
      message: "Todos los campos son requeridos",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      UPDATE comments
      SET
        content = $1,
        updated_at = NOW ()
      WHERE
        id = $2
      RETURNING *
      `,
      [content, commentId],
    );

    if (rows.length !== 1) {
      return res.status(500).json({
        message: "No se pudo actualizar el comentario",
      });
    }

    return res.json({
      data: rows.at(0),
    });
  } catch (_) {
    return res.sendStatus(500);
  }
});

async function isSnippetPublic(id) {
  try {
    const { rows: snippets } = await pool.query(
      "SELECT is_public FROM snippets WHERE id = $1",
      [id],
    );

    if (snippets.length === 0) {
      return false;
    }

    return snippets.at(0).is_public;
  } catch {
    return false;
  }
}

async function commentExists(commentId, userId) {
  try {
    const { rows: comments } = await pool.query(
      "SELECT id FROM comments WHERE id = $1 AND user_id = $2",
      [commentId, userId],
    );

    if (comments.length === 0) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function getCommentId(req) {
  const id = Number.parseInt(req.params.commentId);
  if (Number.isNaN(id)) {
    return null;
  }
  return id;
}
