import pool from "../config/pool.js";

const dashboardService = {
  getDashboard: async () => {
    const client = await pool.connect();

    try {
      const [
        totalMachines,
        machineStatus,
        activeTickets,
        engineers,
        ticketStatus,
        failureTypes,
        criticalMachines,
        problematicMachines,
        monthlyMaintenance,
        latestTickets,
      ] = await Promise.all([
        client.query(`
          SELECT COUNT(*) total
          FROM machines
        `),

        client.query(`
          SELECT status, COUNT(*) total
          FROM machines
          GROUP BY status
        `),

        client.query(`
          SELECT COUNT(*) total
          FROM maintenance_tickets
          WHERE status <> 'Done'
        `),

        client.query(`
          SELECT status, COUNT(*) total
          FROM users
          WHERE role = 'Engineer'
          GROUP BY status
        `),

        client.query(`
          SELECT status, COUNT(*) total
          FROM maintenance_tickets
          GROUP BY status
        `),

        client.query(`
          SELECT type, COUNT(*) total
          FROM failure_statistics
          GROUP BY type
          ORDER BY total DESC
        `),

        client.query(`
          SELECT
            m.id,
            m.name,
            mr.rul_days
          FROM maintenance_recommendations mr
          JOIN data_sensors ds
            ON mr.data_sensors_id = ds.id
          JOIN machines m
            ON ds.machine_id = m.id
          ORDER BY mr.rul_days ASC
          LIMIT 5
        `),

        client.query(`
          SELECT
            m.id,
            m.name,
            COUNT(*) total_failure
          FROM maintenance_tickets mt
          JOIN machines m
            ON mt.machine_id = m.id
          GROUP BY m.id, m.name
          ORDER BY total_failure DESC
          LIMIT 5
        `),

        client.query(`
          SELECT
            DATE_TRUNC('month', created_at) AS month,
            COUNT(*) total
          FROM maintenance_tickets
          GROUP BY month
          ORDER BY month
        `),

        client.query(`
          SELECT
            mt.id,
            mt.status,
            m.name AS machine_name,
            fs.type,
            leader.name AS engineer_name,
            mt.created_at
          FROM maintenance_tickets mt
          JOIN machines m
            ON mt.machine_id = m.id
          JOIN failure_statistics fs
            ON mt.failure_statistic_id = fs.id
          LEFT JOIN maintenance_ticket_assignments mta_leader
            ON mta_leader.maintenance_ticket_id = mt.id
            AND mta_leader.role = 'Leader'
          LEFT JOIN users leader
            ON mta_leader.user_id = leader.id
          ORDER BY mt.created_at DESC
          LIMIT 10
        `),
      ]);

      return {
        summary: {
          total_machines: Number(totalMachines.rows[0].total),
          active_tickets: Number(activeTickets.rows[0].total),
        },

        machine_status: machineStatus.rows,

        engineer_status: engineers.rows,

        ticket_status: ticketStatus.rows,

        failure_types: failureTypes.rows,

        critical_machines: criticalMachines.rows,

        problematic_machines: problematicMachines.rows,

        monthly_maintenance: monthlyMaintenance.rows,

        latest_tickets: latestTickets.rows,
      };
    } finally {
      client.release();
    }
  },
};

export default dashboardService;
