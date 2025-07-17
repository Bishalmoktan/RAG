import pkg from "pg";
import config from "../config/index.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: config.database.postgres.url,
});

export async function initDatabase() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      text TEXT,
      exif JSONB,
      embedding VECTOR(384)
    );
  `);

  console.log("✅ Database initialized");
}
