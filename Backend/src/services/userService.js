import pool from "../utils/pool.js";
import bcrypt from "bcrypt";
import InvariantError from "../exceptions/InvariantError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const userService = {
  create: async (employee_id, name, email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const { rows } = await pool.query(
        `
        INSERT INTO users (
          employee_id,
          name,
          email,
          password,
          role
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          employee_id,
          name,
          email,
          role,
          created_at
        `,
        [employee_id, name, email, hashedPassword, role],
      );

      return rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Email sudah digunakan");
      }

      throw error;
    }
  },

  update: async (id_user, id, name, password, role_user, updatedRole) => {
    const targetUserId = Number(id);

    if (id_user !== targetUserId && role_user !== "Admin") {
      throw new ForbiddenError(
        "Anda tidak memiliki izin untuk memperbarui pengguna ini",
      );
    }

    const targetUserResult = await pool.query(
      `
      SELECT id, role
      FROM users
      WHERE id = $1
      `,
      [targetUserId],
    );

    if (!targetUserResult.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const targetUser = targetUserResult.rows[0];

    let finalRole = targetUser.role;

    if (role_user === "Admin" && updatedRole) {
      finalRole = updatedRole;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const { rows } = await pool.query(
        `
        UPDATE users
        SET
          name = $1,
          password = $2,
          role = $3
        WHERE id = $4
        RETURNING
          id,
          employee_id,
          name,
          email,
          role
        `,
        [name, hashedPassword, finalRole, targetUserId],
      );

      if (!rows.length) {
        throw new NotFoundError("User tidak ditemukan");
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    const { rows } = await pool.query(`
      SELECT
        id,
        employee_id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE role = 'Engineer'
      ORDER BY created_at DESC
    `);

    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        employee_id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [id],
    );

    if (!rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return rows[0];
  },

  deleteById: async (id) => {
    const { rows } = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );

    if (!rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return rows[0];
  },
};

export default userService;
