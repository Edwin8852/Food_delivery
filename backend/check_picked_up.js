import pool from './src/config/dbPool.js';

const check = async () => {
    try {
        const res = await pool.query("SELECT id, delivery_partner_id, order_status FROM orders WHERE order_status = 'PICKED_UP'");
        console.log('Orders with status PICKED_UP:');
        console.table(res.rows);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
