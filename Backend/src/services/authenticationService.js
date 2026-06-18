import pool from "../config/pool.js";
import InvariantError from "../exceptions/InvariantError.js";
import bcrypt from "bcrypt";

const authenticationService = {
  verifyUserCredential: async (email, password) => {
    const { rows } = await pool.query(
      "SELECT id, name, password , email, role, created_at FROM users WHERE email = $1",
      [email],
    );
    const user = rows[0];
    if (!user) {
      throw new InvariantError("Username atau password salah");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new InvariantError("Username atau password salah");
    }

    delete user.password;
    return user;
  },

  createAuthentication: async (id, token) => {
    await pool.query(
      "INSERT INTO authentications (owner, token) VALUES ($1, $2)",
      [id, token],
    );
  },
  verifyToken: async (token) => {
    const { rows } = await pool.query(
      "SELECT * FROM authentications WHERE token = $1",
      [token],
    );
    if (!rows.length) {
      throw new InvariantError("Token tidak ditemukan");
    }
  },

  deleteAuthentication: async (token) => {
    await pool.query("DELETE FROM authentications WHERE token = $1", [token]);
  },

  deleteAuthenticationByUserId: async (userId) => {
    await pool.query("DELETE FROM authentications WHERE owner = $1", [userId]);
  },
};

export default authenticationService;
