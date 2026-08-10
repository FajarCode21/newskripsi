import pool from "../../config/pool.js";

// ============================================================
// MACHINE SERVICE
// ============================================================

const machineService = {
  getAllMachines: async (machineCodeOrName) => {
    const { rows } = await pool.query(
      `
      SELECT
        id, code, name, type, status, location, install_date, created_at
      FROM machines
      WHERE code = $1 OR name ILIKE $1
      ORDER BY id
      LIMIT 1
      `,
      [machineCodeOrName],
    );

    return rows;
  },

  listMachines: async ({ status, type } = {}) => {
    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `
      SELECT
        id, code, name, type, status, location, install_date, created_at
      FROM machines
      ${where}
      ORDER BY code
      `,
      values,
    );

    return rows;
  },
};

// ============================================================
// DATA SENSOR SERVICE
// ============================================================

const dataSensorService = {
  getLatestByMachine: async (machineCodeOrName) => {
    const { rows } = await pool.query(
      `
      SELECT ds.*
      FROM data_sensors ds
      INNER JOIN machines m ON m.id = ds.machine_id
      WHERE m.code = $1 OR m.name ILIKE $1
      ORDER BY ds.date_time DESC
      LIMIT 1
      `,
      [machineCodeOrName],
    );

    return rows;
  },

  getHistoryByMachine: async (machineCodeOrName, limit = 10) => {
    const { rows } = await pool.query(
      `
      SELECT ds.*
      FROM data_sensors ds
      INNER JOIN machines m ON m.id = ds.machine_id
      WHERE m.code = $1 OR m.name ILIKE $1
      ORDER BY ds.date_time DESC
      LIMIT $2
      `,
      [machineCodeOrName, limit],
    );

    return rows;
  },
};

// ============================================================
// MAINTENANCE RECOMMENDATION SERVICE (RUL)
// ============================================================

const maintenanceRecommendationService = {
  getLatestByMachine: async (machineCodeOrName) => {
    const { rows } = await pool.query(
      `
      SELECT
        mr.id, mr.rul_hours, mr.rul_days, mr.status, mr.priority, mr.action, mr.created_at
      FROM maintenance_recommendations mr
      INNER JOIN data_sensors ds ON ds.id = mr.data_sensors_id
      INNER JOIN machines m ON m.id = ds.machine_id
      WHERE m.code = $1 OR m.name ILIKE $1
      ORDER BY mr.created_at DESC
      LIMIT 1
      `,
      [machineCodeOrName],
    );

    return rows;
  },
};

// ============================================================
// FAILURE STATISTIC SERVICE
// ============================================================

const failureStatisticService = {
  getLatestByMachine: async (machineCodeOrName) => {
    const { rows } = await pool.query(
      `
      SELECT
        fs.id, fs.type, fs.confidence,
        fs.heat_dissipation_failure, fs.random_failures,
        fs.overstrain_failure, fs.power_failure, fs.tool_wear_failure,
        fs.created_at
      FROM failure_statistics fs
      INNER JOIN maintenance_recommendations mr ON mr.id = fs.maintenance_recommendation_id
      INNER JOIN data_sensors ds ON ds.id = mr.data_sensors_id
      INNER JOIN machines m ON m.id = ds.machine_id
      WHERE m.code = $1 OR m.name ILIKE $1
      ORDER BY fs.created_at DESC
      LIMIT 1
      `,
      [machineCodeOrName],
    );

    return rows;
  },
};

// ============================================================
// TICKET MAINTENANCE SERVICE
// ============================================================

const ticketMaintenanceService = {
  listAll: async ({ status, machine } = {}) => {
    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`mt.status = $${values.length}`);
    }

    if (machine) {
      values.push(machine);
      conditions.push(
        `(m.code = $${values.length} OR m.name ILIKE $${values.length})`,
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query(
      `
      SELECT
        mt.id, mt.status, mt.notes, mt.created_at, mt.updated_at,
        m.code AS machine_code, m.name AS machine_name,
        fs.type AS failure_type, fs.confidence
      FROM maintenance_tickets mt
      INNER JOIN machines m ON m.id = mt.machine_id
      INNER JOIN failure_statistics fs ON fs.id = mt.failure_statistic_id
      ${where}
      ORDER BY mt.created_at DESC
      `,
      values,
    );

    return rows;
  },

  listByAssignedUser: async (userId, { status, machine } = {}) => {
    const conditions = ["mta.user_id = $1"];
    const values = [userId];

    if (status) {
      values.push(status);
      conditions.push(`mt.status = $${values.length}`);
    }

    if (machine) {
      values.push(machine);
      conditions.push(
        `(m.code = $${values.length} OR m.name ILIKE $${values.length})`,
      );
    }

    const { rows } = await pool.query(
      `
      SELECT DISTINCT
        mt.id, mt.status, mt.notes, mt.created_at, mt.updated_at,
        m.code AS machine_code, m.name AS machine_name,
        fs.type AS failure_type, fs.confidence,
        mta.role AS my_assignment_role
      FROM maintenance_tickets mt
      INNER JOIN maintenance_ticket_assignments mta ON mta.maintenance_ticket_id = mt.id
      INNER JOIN machines m ON m.id = mt.machine_id
      INNER JOIN failure_statistics fs ON fs.id = mt.failure_statistic_id
      WHERE ${conditions.join(" AND ")}
      ORDER BY mt.created_at DESC
      `,
      values,
    );

    return rows;
  },

  getDetailById: async (ticketId) => {
    const { rows } = await pool.query(
      `
      SELECT
        mt.id, mt.status, mt.notes, mt.created_at, mt.updated_at,
        m.code AS machine_code, m.name AS machine_name, m.location,
        fs.type AS failure_type, fs.confidence
      FROM maintenance_tickets mt
      INNER JOIN machines m ON m.id = mt.machine_id
      INNER JOIN failure_statistics fs ON fs.id = mt.failure_statistic_id
      WHERE mt.id = $1
      `,
      [ticketId],
    );

    return rows[0] || null;
  },

  isUserAssigned: async (ticketId, userId) => {
    const { rows } = await pool.query(
      `
      SELECT 1 FROM maintenance_ticket_assignments
      WHERE maintenance_ticket_id = $1 AND user_id = $2
      LIMIT 1
      `,
      [ticketId, userId],
    );

    return rows.length > 0;
  },
};

// ============================================================
// MAINTENANCE REPORT SERVICE
// ============================================================

const maintenanceReportService = {
  getByTicketId: async (ticketId) => {
    const { rows } = await pool.query(
      `
      SELECT id, description, action_taken, notes, duration_hours, created_at, updated_at
      FROM maintenance_reports
      WHERE maintenance_ticket_id = $1
      `,
      [ticketId],
    );

    return rows;
  },
};

// ============================================================
// USER SERVICE
// ============================================================

const userService = {
  findByIdentifier: async (identifier) => {
    const { rows } = await pool.query(
      `
      SELECT id, employee_id, name, email, status, role, created_at
      FROM users
      WHERE employee_id = $1 OR email = $1 OR name ILIKE $1
      `,
      [identifier],
    );

    return rows;
  },
};

// ============================================================
// EXPORTS
// ============================================================

export {
  machineService,
  dataSensorService,
  maintenanceRecommendationService,
  failureStatisticService,
  ticketMaintenanceService,
  maintenanceReportService,
  userService,
};
