import pool from './src/config/dbPool.js';

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const init = async () => {
  try {
    await pool.query(createTableQuery);
    console.log('✅ Addresses table initialized');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create table:', err);
    process.exit(1);
  }
};

init();
