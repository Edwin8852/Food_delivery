import pool from './src/config/dbPool.js';

const check = async () => {
    try {
        const res = await pool.query("SELECT id, order_status FROM orders");
        console.log('All Orders:');
        console.table(res.rows);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
