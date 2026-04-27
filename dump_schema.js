import sequelize from './src/config/db.js';
const inspectAll = async () => {
    try {
        const [results] = await sequelize.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name, column_name
        `);
        console.log('--- Database Schema Dump ---');
        results.forEach(r => console.log(`${r.table_name}.${r.column_name}: ${r.data_type}`));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
inspectAll();
