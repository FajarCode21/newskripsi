import pool from "../utils/pool.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const machineService = {
  getAll: async () => {
    const { rows } = await pool.query(
      "SELECT id, code, name, type, location, install_date FROM machines",
    );
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query(
      "SELECT id, code, name, type, location, install_date FROM machines WHERE id = $1",
      [id],
    );
    if (!rows.length) {
      throw new NotFoundError("Machine tidak ditemukan");
    }
    return rows[0];
  },

  create: async (code, name, type, location, install_date) => {
    const { rows } = await pool.query(
      "INSERT INTO machines (code, name, type, location, install_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, code, name, type, location, install_date",
      [code, name, type, location, install_date],
    );
    return rows[0];
  },

  update: async (id, code, name, type, location, install_date) => {
    const { rows } = await pool.query(
      "UPDATE machines SET code = $1, name = $2, type = $3, location = $4, install_date = $5 WHERE id = $6 RETURNING id, code, name, type, location, install_date",
      [code, name, type, location, install_date, id],
    );
    return rows[0];
  },

  deleteById: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM machines WHERE id = $1 RETURNING id",
      [id],
    );
    if (!rows.length) {
      throw new NotFoundError("Machine tidak ditemukan");
    }
    return rows[0];
  },
};

export default machineService;
