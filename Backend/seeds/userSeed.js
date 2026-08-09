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
     'Engineer User',
     'engineer1@gmail.com',
     '$2a$12$tFs7xFXnTWL1XoAU/1ORkO3BteofbU.jC6qfjCWW7HTCqRJKKhwAW', 
     'Engineer'
    ),
    (
     'ENG002',
     'Engineer User 2',
     'engineer2@gmail.com',
     '$2a$12$tFs7xFXnTWL1XoAU/1ORkO3BteofbU.jC6qfjCWW7HTCqRJKKhwAW', 
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
