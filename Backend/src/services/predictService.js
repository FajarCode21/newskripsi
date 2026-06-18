import pool from "../config/pool.js";

const createRecommendation = async (client, data) => {
  const { rows } = await client.query(
    `
    INSERT INTO maintenance_recommendations (
      rul_hours,
      rul_days,
      status,
      priority,
      action,
      data_sensors_id
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id
    `,
    [
      data.prediction.rul_hours,
      data.prediction.rul_days,
      data.prediction.status,
      data.prediction.priority,
      data.prediction.action,
      data.sensor_id,
    ],
  );

  return rows[0].id;
};

const createFailureStatistic = async (client, recommendationId, failure) => {
  if (!failure?.type) {
    return null;
  }

  const { rows } = await client.query(
    `
    INSERT INTO failure_statistics (
      type,
      confidence,
      heat_dissipation_failure,
      random_failures,
      overstrain_failure,
      power_failure,
      tool_wear_failure,
      maintenance_recommendation_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id
    `,
    [
      failure.type,
      failure.confidence,

      failure.probabilities?.["Heat Dissipation Failure"] ?? 0,

      failure.probabilities?.["Random Failures"] ?? 0,

      failure.probabilities?.["Overstrain Failure"] ?? 0,

      failure.probabilities?.["Power Failure"] ?? 0,

      failure.probabilities?.["Tool Wear Failure"] ?? 0,

      recommendationId,
    ],
  );

  return rows[0].id;
};

const createMaintenanceTicket = async (
  client,
  machineId,
  failureStatisticId,
) => {
  if (!failureStatisticId) {
    return;
  }

  await client.query(
    `
    INSERT INTO maintenance_tickets (
      machine_id,
      failure_statistic_id
    )
    VALUES ($1,$2)
    `,
    [machineId, failureStatisticId],
  );
};

const predictService = {
  createPrediction: async (data) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const recommendationId = await createRecommendation(client, data);

      const failureStatisticId = await createFailureStatistic(
        client,
        recommendationId,
        data.failure,
      );

      await createMaintenanceTicket(
        client,
        data.machine_id,
        failureStatisticId,
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default predictService;
