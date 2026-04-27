import sequelize from './src/config/db.js';
import fs from 'fs';
const check = async () => {
    try {
        const [results] = await sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'orders'
            ORDER BY column_name
        `);
        let output = '--- Current orders table columns ---\n';
        results.forEach(r => {
            const flag = (r.data_type === 'integer' && r.column_name.endsWith('_id')) ? ' <-- MISMATCH!' : '';
            output += `${r.column_name}: ${r.data_type}${flag}\n`;
        });
        fs.writeFileSync('./orders_check.log', output, 'utf8');
        console.log('Done. Check orders_check.log');
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('./orders_check.log', e.toString(), 'utf8');
        console.error(e);
        process.exit(1);
    }
}
check();
