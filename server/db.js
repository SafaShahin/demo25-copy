import pg from 'pg';

const { Pool } = pg;

// connection to PostgreSQL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, //  system environment variable
  ssl: {rejectUnauthorized: false}, // Render PostgreSQL

});

export default pool;
