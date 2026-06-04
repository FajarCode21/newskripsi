import pool from "../utils/pool.js";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

const dataSensorService = {
  create: async (data) => {
    const isBatch = Array.isArray(data);
    const valuesArray = isBatch ? data : [data];

    let query = `
    WITH inserted AS (
      INSERT INTO data_sensors (
        date_time, rotational_speed, process_temperature, air_temperature,
        torque, tool_wear, machine_age_hours, hours_since_last,
        temp_rate_of_change, rpm_variance, machine_id
      )
      VALUES
  `;

    const values = [];
    const rowsSql = valuesArray
      .map((item, i) => {
        const baseIndex = i * 11;

        values.push(
          item.date_time,
          item.rotational_speed,
          item.process_temperature,
          item.air_temperature,
          item.torque,
          item.tool_wear,
          item.machine_age_hours,
          item.hours_since_last,
          item.temp_rate_of_change,
          item.rpm_variance,
          item.machine_id,
        );

        return `(
      $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, 
      $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, 
      $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, 
      $${baseIndex + 10}, $${baseIndex + 11}
    )`;
      })
      .join(",");

    query +=
      rowsSql +
      `
      RETURNING *
    )
    SELECT inserted.*, m.type AS machine_type
    FROM inserted
    JOIN machines m ON inserted.machine_id = m.id
  `;

    const { rows } = await pool.query(query, values);

    return isBatch ? rows : rows[0];
  },
};

export default dataSensorService;
