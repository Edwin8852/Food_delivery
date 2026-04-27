import sequelize from './src/config/db.js';
const findMismatches = async () => {
    try {
        const [results] = await sequelize.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND data_type = 'integer'
            ORDER BY table_name, column_name
        `);
        console.log('--- Integer Columns Search ---');
        results.forEach(r => {
            console.log(`MismatchCheck: ${r.table_name}.${r.column_name} is ${r.data_type}`);
        });
        
        const [results2] = await sequelize.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND (column_name LIKE '%_id' OR column_name = 'id')
            ORDER BY table_name, column_name
        `);
        console.log('\n--- ID-like Columns Type Search ---');
        results2.forEach(r => {
            console.log(`MismatchCheck: ${r.table_name}.${r.column_name} is ${r.data_type}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
findMismatches();
