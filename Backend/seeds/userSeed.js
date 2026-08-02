import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const userSeed = async () => {
  const query = `
    INSERT INTO users (employee_id, name, email, password, role) VALUES
    (
      'ADMIN001',
      'Admin User',
      'admin123@gmail.com',
      '$2a$12$tFs7xFXnTWL1XoAU/1ORkO3BteofbU.jC6qfjCWW7HTCqRJKKhwAW', 
      'Admin'
    ),
    (
      'ENG001',
      'Fajar',
      'fajar123@gmail.com',
      '$2y$12$0c3HLB/HejoL/dqrgCrK/.2k5hCVAFY69J5aHvp5gMScAHZHDgdhO', 
      'Engineer'
    ),
    (
      'ENG002',
      'Rizky',
      'rizky123@gmail.com',
      '$2y$12$mAQOyFgKRI.EEef.iidozuYe1QXeFZzgeT1ZLkBTMwyZRx0oIlwhi', 
      'Engineer'
    )
    ON CONFLICT (email) DO NOTHING;
  `;

  try {
    await pool.query(query);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users", error);
  } finally {
    await pool.end();
  }
};

export default userSeed;
