import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ==== KONFIGURASI ====
const MONTHS_BACK = 6; // seberapa jauh data tiket dibuat ke belakang
const TICKETS_PER_MONTH = { min: 8, max: 16 };

const FAILURE_TYPES = [
  "Tool Wear Failure",
  "Heat Dissipation Failure",
  "Power Failure",
  "Overstrain Failure",
  "Random Failures",
];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

// URL gambar default untuk seed laporan (tidak perlu file unik per laporan)
const DEFAULT_REPORT_IMAGE_URL = "/uploads/reports/default.webp";

// ==== HELPERS ====
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, decimals = 2) =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const pickMany = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const randomDateInMonth = (monthsAgo) => {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const daysInMonth = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    0,
  ).getDate();
  const day = randInt(1, daysInMonth);
  const hour = randInt(6, 21);
  const minute = randInt(0, 59);
  return new Date(base.getFullYear(), base.getMonth(), day, hour, minute);
};

// Hanya dua status: WaitingAssignment atau Done.
// Makin lama bulannya, makin besar peluang statusnya sudah Done.
// Makin baru bulannya, makin besar peluang masih WaitingAssignment.
const pickStatusForMonth = (monthsAgo) => {
  const doneWeight = Math.min(0.9, 0.4 + monthsAgo * 0.1);
  return Math.random() < doneWeight ? "Done" : "WaitingAssignment";
};

const seedTicketChain = async (
  client,
  { machineId, engineerIds, monthsAgo },
) => {
  const createdAt = randomDateInMonth(monthsAgo);
  const status = pickStatusForMonth(monthsAgo);

  // 1. data_sensors
  const { rows: sensorRows } = await client.query(
    `
    INSERT INTO data_sensors
      (date_time, rotational_speed, process_temperature, air_temperature,
       torque, tool_wear, machine_age_hours, hours_since_last,
       temp_rate_of_change, rpm_variance, machine_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING id
    `,
    [
      createdAt,
      randFloat(1200, 2800, 1),
      randFloat(295, 320, 1),
      randFloat(290, 305, 1),
      randFloat(20, 65, 1),
      randFloat(0, 250, 1),
      randFloat(500, 15000, 1),
      randFloat(1, 200, 1),
      randFloat(-2, 2, 2),
      randFloat(1, 20, 2),
      machineId,
    ],
  );
  const sensorId = sensorRows[0].id;

  // 2. maintenance_recommendations
  const rulHours = randFloat(2, 400, 1);
  const priority =
    rulHours < 24 ? "Critical" : rulHours < 72 ? "High" : pick(PRIORITIES);

  const { rows: recRows } = await client.query(
    `
    INSERT INTO maintenance_recommendations
      (rul_hours, rul_days, status, priority, action, data_sensors_id, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id
    `,
    [
      rulHours,
      Number((rulHours / 24).toFixed(2)),
      "Active",
      priority,
      "Lakukan pemeriksaan dan pemeliharaan sesuai jenis kerusakan terdeteksi",
      sensorId,
      createdAt,
    ],
  );
  const recommendationId = recRows[0].id;

  // 3. failure_statistics
  const failureType = pick(FAILURE_TYPES);
  const { rows: failRows } = await client.query(
    `
    INSERT INTO failure_statistics
      (type, confidence, heat_dissipation_failure, random_failures,
       overstrain_failure, power_failure, tool_wear_failure,
       maintenance_recommendation_id, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id
    `,
    [
      failureType,
      randFloat(0.6, 0.99, 2),
      randFloat(0, 1, 2),
      randFloat(0, 1, 2),
      randFloat(0, 1, 2),
      randFloat(0, 1, 2),
      randFloat(0, 1, 2),
      recommendationId,
      createdAt,
    ],
  );
  const failureStatisticId = failRows[0].id;

  // 4. maintenance_tickets
  const ticketNotes =
    Math.random() < 0.3
      ? "Prioritaskan pengecekan komponen terkait juga"
      : null;

  const { rows: ticketRows } = await client.query(
    `
    INSERT INTO maintenance_tickets
      (machine_id, failure_statistic_id, status, notes, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id
    `,
    [machineId, failureStatisticId, status, ticketNotes, createdAt, createdAt],
  );
  const ticketId = ticketRows[0].id;

  // 5. assignment (hanya untuk tiket yang sudah Done, WaitingAssignment belum ditugaskan)
  if (status === "Done" && engineerIds.length) {
    const team = pickMany(
      engineerIds,
      randInt(1, Math.min(3, engineerIds.length)),
    );

    await client.query(
      `
      INSERT INTO maintenance_ticket_assignments
        (maintenance_ticket_id, user_id, role, created_at)
      VALUES ($1, $2, 'Leader', $3)
      `,
      [ticketId, team[0], createdAt],
    );

    for (const memberId of team.slice(1)) {
      await client.query(
        `
        INSERT INTO maintenance_ticket_assignments
          (maintenance_ticket_id, user_id, role, created_at)
        VALUES ($1, $2, 'Member', $3)
        `,
        [ticketId, memberId, createdAt],
      );
    }
  }

  // 6. laporan (hanya untuk tiket yang sudah Done)
  if (status === "Done") {
    const { rows: reportRows } = await client.query(
      `
      INSERT INTO maintenance_reports
        (maintenance_ticket_id, description, action_taken, notes, duration_hours, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
      `,
      [
        ticketId,
        `Ditemukan indikasi ${failureType.toLowerCase()} pada komponen mesin`,
        "Dilakukan perbaikan dan penggantian komponen yang bermasalah",
        Math.random() < 0.4 ? "Disarankan pengecekan rutin berikutnya" : null,
        randFloat(0.5, 8, 2),
        createdAt,
        createdAt,
      ],
    );

    await client.query(
      `
      INSERT INTO report_images (report_id, image_url)
      VALUES ($1, $2)
      `,
      [reportRows[0].id, DEFAULT_REPORT_IMAGE_URL],
    );
  }
};

const ticketSeed = async () => {
  const client = await pool.connect();

  try {
    const { rows: machines } = await client.query(`SELECT id FROM machines`);
    const { rows: engineers } = await client.query(
      `SELECT id FROM users WHERE role = 'Engineer'`,
    );

    if (!machines.length) {
      console.log("Belum ada data machines, jalankan machineSeed dulu");
      return;
    }
    if (!engineers.length) {
      console.log("Belum ada data engineer, jalankan userSeed dulu");
      return;
    }

    const machineIds = machines.map((m) => m.id);
    const engineerIds = engineers.map((e) => e.id);

    for (let monthsAgo = MONTHS_BACK - 1; monthsAgo >= 0; monthsAgo--) {
      const count = randInt(TICKETS_PER_MONTH.min, TICKETS_PER_MONTH.max);

      for (let i = 0; i < count; i++) {
        await seedTicketChain(client, {
          machineId: pick(machineIds),
          engineerIds,
          monthsAgo,
        });
      }
    }

    console.log("Tickets seeded successfully");
  } catch (error) {
    console.error("Error seeding tickets", error);
  } finally {
    client.release();
    await pool.end();
  }
};

export default ticketSeed;
