import sequelize from './src/config/db.js';

const inspectSchema = async () => {
    try {
        const [results] = await sequelize.query(`
            SELECT 
                conname, 
                pg_get_constraintdef(c.oid)
            FROM 
                pg_constraint c
            JOIN 
                pg_namespace n ON n.oid = c.connamespace
            WHERE 
                contype = 'c' 
                AND conname LIKE 'orders_payment_status_check%';
        `);
        console.log('--- CHECK CONSTRAINTS ---');
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Inspection failed:', err);
        process.exit(1);
    }
};

inspectSchema();
