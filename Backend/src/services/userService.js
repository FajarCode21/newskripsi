import pool from "../config/pool.js";
import bcrypt from "bcrypt";
import InvariantError from "../exceptions/InvariantError.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const userService = {
  createUser: async (employee_id, name, email, password, role) => {
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
      console.log(error);
      if (error.code === "23505") {
        throw new InvariantError(
          "Email sudah atau employee_id sudah digunakan",
        );
      }

      throw error;
    }
  },

  updateUser: async (id_user, id, name, password, role_user, updatedRole) => {
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

    if (
      role_user === "Admin" &&
      targetUser.role === "Admin" &&
      id_user !== targetUserId
    ) {
      throw new ForbiddenError("Admin tidak dapat mengubah akun Admin lain");
    }

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

  getAllUsers: async (search = "") => {
    const keyword = `%${search}%`;

    const { rows } = await pool.query(
      `
    SELECT
      id,
      employee_id,
      name,
      email,
      status,
      role,
      created_at
    FROM users
    WHERE
      ($1 = '%%'
        OR name ILIKE $1
        OR email ILIKE $1)
    ORDER BY role ASC, created_at DESC
    `,
      [keyword],
    );

    return rows;
  },

  getUserById: async (id) => {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        employee_id,
        name,
        email,
        status,
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

  deleteUserById: async (id) => {
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
