import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const machineSeed = async () => {
  const query = `
    INSERT INTO machines (code, name, type, location, install_date, status) VALUES
    ('MCH-001', 'CNC Lathe A1', 'H', 'Plant A - Line 1', '2020-03-12', 'Active'),
    ('MCH-002', 'Drill Press B2', 'M', 'Plant A - Line 2', '2021-07-21', 'Active'),
    ('MCH-003', 'Milling Unit C3', 'L', 'Plant B - Line 1', '2019-11-05', 'Active'),
    ('MCH-004', 'Grinding Pro X', 'M', 'Plant B - Line 3', '2022-01-15', 'Active'),
    ('MCH-005', 'Cutter ZX-1', 'H', 'Plant C - Line 2', '2020-06-30', 'Active'),
    ('MCH-006', 'Lathe Compact', 'L', 'Plant A - Line 4', '2018-09-10', 'Active'),
    ('MCH-007', 'Hydraulic Press 7', 'H', 'Plant B - Line 2', '2021-04-18', 'Active'),
    ('MCH-008', 'Auto Drill X2', 'M', 'Plant C - Line 1', '2020-12-01', 'Active'),
    ('MCH-009', 'Precision Mill', 'H', 'Plant A - Line 3', '2019-08-23', 'Active'),
    ('MCH-010', 'Grinder Mini', 'L', 'Plant B - Line 4', '2022-02-14', 'Active'),

    ('MCH-011', 'Lathe Pro 200', 'H', 'Plant A - Line 1', '2021-03-11', 'Active'),
    ('MCH-012', 'DrillMaster 500', 'M', 'Plant A - Line 2', '2020-05-19', 'Active'),
    ('MCH-013', 'MillWorks Basic', 'L', 'Plant B - Line 3', '2019-10-02', 'Active'),
    ('MCH-014', 'GrindForce X', 'M', 'Plant C - Line 1', '2022-01-08', 'Active'),
    ('MCH-015', 'CutPro Elite', 'H', 'Plant C - Line 2', '2020-07-27', 'Active'),
    ('MCH-016', 'Lathe Smart', 'M', 'Plant A - Line 4', '2018-11-15', 'Active'),
    ('MCH-017', 'PressMax 900', 'H', 'Plant B - Line 2', '2021-06-05', 'Active'),
    ('MCH-018', 'Drill Auto 300', 'L', 'Plant C - Line 3', '2020-09-09', 'Active'),
    ('MCH-019', 'Mill Advanced', 'H', 'Plant A - Line 3', '2019-07-14', 'Active'),
    ('MCH-020', 'Grinder Ultra', 'M', 'Plant B - Line 1', '2022-03-22', 'Active'),

    ('MCH-021', 'Lathe Edge', 'L', 'Plant A - Line 2', '2021-02-17', 'Active'),
    ('MCH-022', 'Drill Compact', 'M', 'Plant C - Line 4', '2020-06-06', 'Active'),
    ('MCH-023', 'Mill Xtreme', 'H', 'Plant B - Line 3', '2019-12-12', 'Active'),
    ('MCH-024', 'GrindCore', 'L', 'Plant C - Line 2', '2022-01-19', 'Active'),
    ('MCH-025', 'CutMaster Pro', 'H', 'Plant A - Line 1', '2020-08-08', 'Active'),
    ('MCH-026', 'Lathe Neo', 'M', 'Plant B - Line 4', '2018-10-25', 'Active'),
    ('MCH-027', 'Press Titan', 'H', 'Plant B - Line 2', '2021-05-30', 'Active'),
    ('MCH-028', 'Drill Flex', 'L', 'Plant C - Line 1', '2020-11-11', 'Active'),
    ('MCH-029', 'Mill Proline', 'M', 'Plant A - Line 3', '2019-06-18', 'Active'),
    ('MCH-030', 'Grinder Xpert', 'H', 'Plant B - Line 1', '2022-04-04', 'Active');
    `;

  try {
    await pool.query(query);
    console.log('Machines seeded successfully');
  } catch (error) {
    console.log('Error seeding machines', error);
  } finally {
    pool.end();
  }
};

export default machineSeed;
