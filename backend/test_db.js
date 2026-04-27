import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'food_delivery'
});

async function run() {
  await client.connect();
  const tables = ['cart'];
  for (const t of tables) {
    const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${t}'`);
    console.log(t, ':', res.rows.map(r => r.column_name));
  }
  await client.end();
}
run().catch(console.error);
