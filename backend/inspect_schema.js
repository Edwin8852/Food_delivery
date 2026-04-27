import sequelize from './src/config/db.js';
const inspectSchema = async () => {
  try {
    const tables = ['orders', 'users', 'restaurants', 'foods', 'order_items', 'addresses', 'delivery_partners'];
    for (const table of tables) {
        const [results] = await sequelize.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = '${table}'
          ORDER BY column_name
        `);
        console.log(`--- ${table} Table Schema ---`);
        results.forEach(row => console.log(`${row.column_name}: ${row.data_type}`));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
inspectSchema();
