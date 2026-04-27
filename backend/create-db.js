import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
// Connect to the default 'postgres' database first
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres', 
});

async function createDb() {
  console.log('📡 Attempting to create "food_delivery" database...');
  try {
    await pool.query('CREATE DATABASE food_delivery');
    console.log('✅ Database "food_delivery" created successfully!');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('ℹ️ Database "food_delivery" already exists.');
    } else {
      console.error('❌ Error creating database:', err.message);
    }
  } finally {
    await pool.end();
  }
}

createDb();
