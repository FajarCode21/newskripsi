import pool from "../../config/pool.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

const chatHistoryService = {
  createSession: async (userId, title = "New Chat") => {
    const { rows } = await pool.query(
      `
      INSERT INTO chat_sessions (user_id, title, context)
      VALUES ($1, $2, '{}'::jsonb)
      RETURNING id, user_id, title, context, created_at, updated_at
      `,
      [userId, title],
    );

    return rows[0];
  },

  getSessionById: async (sessionId, userId) => {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        user_id,
        title,
        context,
        created_at,
        updated_at
      FROM chat_sessions
      WHERE id = $1
        AND user_id = $2
      `,
      [sessionId, userId],
    );

    if (!rows.length) {
      throw new NotFoundError("Chat session tidak ditemukan");
    }

    return rows[0];
  },

  getSessionsByUserId: async (userId) => {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        user_id,
        title,
        context,
        created_at,
        updated_at
      FROM chat_sessions
      WHERE user_id = $1
      ORDER BY updated_at DESC
      `,
      [userId],
    );

    return rows;
  },

  // ===========================
  // BARU: update context session (mis. lastMachineCode)
  // ===========================
  updateSessionContext: async (sessionId, userId, contextPatch) => {
    const { rows } = await pool.query(
      `
      UPDATE chat_sessions
      SET
        context = context || $3::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND user_id = $2
      RETURNING id, context
      `,
      [sessionId, userId, JSON.stringify(contextPatch)],
    );

    if (!rows.length) {
      throw new NotFoundError("Chat session tidak ditemukan");
    }

    return rows[0];
  },

  addMessage: async (sessionId, role, content) => {
    const { rows } = await pool.query(
      `
      INSERT INTO chat_messages (
        session_id,
        role,
        content
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        session_id,
        role,
        content,
        created_at
      `,
      [sessionId, role, content],
    );

    await pool.query(
      `
      UPDATE chat_sessions
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [sessionId],
    );

    return rows[0];
  },

  getMessages: async (sessionId, userId, limit = 10) => {
    const { rows } = await pool.query(
      `
      SELECT
        cm.id,
        cm.session_id,
        cm.role,
        cm.content,
        cm.created_at
      FROM chat_messages cm
      INNER JOIN chat_sessions cs
        ON cs.id = cm.session_id
      WHERE
        cm.session_id = $1
        AND cs.user_id = $2
      ORDER BY cm.created_at DESC
      LIMIT $3
      `,
      [sessionId, userId, limit],
    );

    return rows.reverse();
  },

  deleteSession: async (sessionId, userId) => {
    const { rows } = await pool.query(
      `
      DELETE FROM chat_sessions
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [sessionId, userId],
    );

    if (!rows.length) {
      throw new NotFoundError("Chat session tidak ditemukan");
    }

    return rows[0];
  },
};

export default chatHistoryService;
