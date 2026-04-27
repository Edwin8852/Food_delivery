import db from './src/config/db.js';

async function addCol(table, col) {
  try {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${col} TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`);
    console.log(`Added ${col} to ${table}`);
  } catch (e) {
    if (e.code === '42701') {
      console.log(`${col} already exists on ${table}`);
    } else {
      console.error(`Error adding to ${table}:`, e.message);
    }
  }
}

async function fix() {
  await addCol('restaurants', 'updated_at');
  await addCol('users', 'updated_at');
  await addCol('menu_items', 'updated_at');
  await addCol('cart', 'updated_at');
  await addCol('cart', 'created_at');
  await addCol('addresses', 'updated_at');
  await addCol('orders', 'updated_at');
  await addCol('reviews', 'updated_at');
  process.exit(0);
}

fix();
