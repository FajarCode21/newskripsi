import pool from "../config/pool.js";
import ForbiddenError from "../exceptions/ForbiddenError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const syncEngineerStatus = async (client, engineer_id) => {
  const { rows } = await client.query(
    `
    SELECT COUNT(*)::int AS total
    FROM maintenance_tickets
    WHERE assigned_engineer_id = $1
    AND status = 'InProgress'
    `,
    [engineer_id],
  );

  const status = rows[0].total > 0 ? "Onduty" : "Active";

  await client.query(
    `
    UPDATE users
    SET status = $1
    WHERE id = $2
    `,
    [status, engineer_id],
  );
};

const syncMachineStatus = async (client, machine_id) => {
  const { rows } = await client.query(
    `
    SELECT COUNT(*)::int AS total
    FROM maintenance_tickets
    WHERE machine_id = $1
    AND status = 'InProgress'
    `,
    [machine_id],
  );

  const status = rows[0].total > 0 ? "Maintenance" : "Active";

  await client.query(
    `
    UPDATE machines
    SET status = $1
    WHERE id = $2
    `,
    [status, machine_id],
  );
};
const verifyUser = async (ticket_id, user_id) => {
  const { rows } = await pool.query(
    `
      SELECT id
      FROM maintenance_tickets
      WHERE id = $1
      AND assigned_engineer_id = $2
    `,
    [ticket_id, user_id],
  );

  return rows.length > 0;
};

const verifyEngineer = async (engineer_id) => {
  const { rows } = await pool.query(
    `
      SELECT id
      FROM users
      WHERE id = $1
      AND role = 'Engineer'
    `,
    [engineer_id],
  );

  if (!rows.length) {
    throw new NotFoundError("Engineer tidak ditemukan");
  }
};

const verifyStatus = async (ticket_id, expectedStatus) => {
  const { rows } = await pool.query(
    `
      SELECT status
      FROM maintenance_tickets
      WHERE id = $1
    `,
    [ticket_id],
  );

  if (!rows.length) {
    throw new NotFoundError("Tiket tidak ditemukan");
  }

  if (rows[0].status !== expectedStatus) {
    throw new ForbiddenError(`Status tiket harus ${expectedStatus}`);
  }
};

const ticketMaintenanceService = {
  getAllTickets: async (user_id, role) => {
    let query = `
      SELECT
        mt.id,
        mt.status,
        m.name AS machine_name,
        fs.type,
        mt.assigned_engineer_id,
        u.name AS engineer_name,
        mReport.description,
        mReport.action_taken,
        mReport.notes,
        mReport.duration_hours,
        ri.image_url,
        mt.created_at
      FROM maintenance_tickets mt
      JOIN machines m ON mt.machine_id = m.id
      JOIN failure_statistics fs ON mt.failure_statistic_id = fs.id
      LEFT JOIN users u
        ON mt.assigned_engineer_id = u.id
      LEFT JOIN maintenance_reports mReport
        ON mt.id = mReport.maintenance_ticket_id
      LEFT JOIN report_images ri
        ON mReport.id = ri.report_id
    `;

    const params = [];

    if (role !== "Admin") {
      query += ` WHERE mt.assigned_engineer_id = $1 `;
      params.push(user_id);
    }

    query += ` ORDER BY mt.created_at DESC `;

    const { rows } = await pool.query(query, params);

    return rows;
  },

  getTicketById: async (id, user_id, role) => {
    if (role !== "Admin" && !(await verifyUser(id, user_id))) {
      throw new ForbiddenError(
        "Anda tidak memiliki izin untuk melihat tiket ini",
      );
    }

    const { rows } = await pool.query(
      `
      SELECT
        mt.id,
        mt.status,
        m.name AS machine_name,
        mr.rul_hours,
        mr.rul_days,
        mr.status AS maintenance_status,
        mr.priority,
        mr.action,
        fs.confidence,
        fs.type,
        mt.assigned_engineer_id,
        u.name AS engineer_name,
        mt.created_at
      FROM maintenance_tickets mt
      JOIN machines m ON mt.machine_id = m.id
      JOIN failure_statistics fs ON mt.failure_statistic_id = fs.id
      LEFT JOIN users u ON mt.assigned_engineer_id = u.id
      JOIN maintenance_recommendations mr ON fs.maintenance_recommendation_id = mr.id
      WHERE mt.id = $1
      `,
      [id],
    );

    if (!rows.length) {
      throw new NotFoundError("Tiket tidak ditemukan");
    }

    return rows[0];
  },

  assignTicket: async (id, assigned_engineer_id) => {
    await verifyEngineer(assigned_engineer_id);
    await verifyStatus(id, "WaitingAssignment");

    const { rows } = await pool.query(
      `
      UPDATE maintenance_tickets
      SET
        assigned_engineer_id = $1,
        status = 'Assigned',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [assigned_engineer_id, id],
    );

    return rows[0];
  },

  startTicket: async (id, user_id) => {
    if (!(await verifyUser(id, user_id))) {
      throw new ForbiddenError(
        "Anda tidak memiliki izin untuk memulai maintenance",
      );
    }

    await verifyStatus(id, "Assigned");

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `
      UPDATE maintenance_tickets
      SET
        status = 'InProgress',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING machine_id, assigned_engineer_id
      `,
        [id],
      );

      const ticket = rows[0];

      await syncEngineerStatus(client, ticket.assigned_engineer_id);

      await syncMachineStatus(client, ticket.machine_id);

      await client.query("COMMIT");

      return ticket;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  submitTicket: async (id, user_id, data, file) => {
    if (!(await verifyUser(id, user_id))) {
      throw new ForbiddenError(
        "Anda tidak memiliki izin untuk submit maintenance",
      );
    }

    await verifyStatus(id, "InProgress");

    const client = await pool.connect();

    let imageUrl = null;

    try {
      await client.query("BEGIN");

      const { rows: reports } = await client.query(
        `
      INSERT INTO maintenance_reports
      (
        maintenance_ticket_id,
        description,
        action_taken,
        notes,
        duration_hours
      )
      VALUES
      ($1,$2,$3,$4,$5)
      RETURNING *
      `,
        [
          id,
          data.description,
          data.action_taken,
          data.notes,
          data.duration_hours,
        ],
      );

      const report = reports[0];

      if (file) {
        const uploadDir = path.resolve("uploads/reports");

        await fs.mkdir(uploadDir, {
          recursive: true,
        });

        const filename = `${Date.now()}-${report.id}.webp`;

        await sharp(file.buffer)
          .webp({
            quality: 80,
          })
          .toFile(path.join(uploadDir, filename));

        imageUrl = `/uploads/reports/${filename}`;

        await client.query(
          `
        INSERT INTO report_images
        (
          report_id,
          image_url
        )
        VALUES
        ($1,$2)
        `,
          [report.id, imageUrl],
        );
      }

      const { rows } = await client.query(
        `
      UPDATE maintenance_tickets
      SET
        status='WaitingApproval',
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$1
      RETURNING *
      `,
        [id],
      );

      await client.query("COMMIT");

      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");

      if (imageUrl) {
        try {
          await fs.unlink(path.resolve(`.${imageUrl}`));
        } catch {}
      }

      throw error;
    } finally {
      client.release();
    }
  },

  approveTicket: async (id) => {
    await verifyStatus(id, "WaitingApproval");

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `
      UPDATE maintenance_tickets
      SET
        status = 'Done',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING machine_id, assigned_engineer_id
      `,
        [id],
      );

      const ticket = rows[0];

      await syncEngineerStatus(client, ticket.assigned_engineer_id);

      await syncMachineStatus(client, ticket.machine_id);

      await client.query("COMMIT");

      return ticket;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default ticketMaintenanceService;
