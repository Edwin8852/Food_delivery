import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'postgres',
  password: 'edwin@321',
  host: 'localhost',
  port: 5432,
  database: 'food_delivery'
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
  for (let row of res.rows) {
    try {
      await client.query(`UPDATE "${row.tablename}" SET "createdAt" = NOW() WHERE "createdAt" IS NULL`);
      await client.query(`UPDATE "${row.tablename}" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL`);
    } catch(e) {}
  }
  console.log('Fixed null dates');
  await client.end();
}

run();
