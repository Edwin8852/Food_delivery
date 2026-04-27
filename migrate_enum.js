import pool from './src/config/dbPool.js';

const migrate = async () => {
    try {
        console.log('🚀 Updating Order Status ENUM in PostgreSQL...');
        
        // PostgreSQL requires separate commands for adding ENUM values
        await pool.query("ALTER TYPE \"enum_orders_order_status\" ADD VALUE IF NOT EXISTS 'OUT_FOR_DELIVERY'");
        
        console.log('✅ Order status ENUM expanded successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
