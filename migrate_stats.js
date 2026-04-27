import pool from './src/config/dbPool.js';

const migrate = async () => {
    try {
        console.log('🚀 Adding availability and performance fields to users table...');
        
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS "isBusy" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "currentOrderId" UUID,
            ADD COLUMN IF NOT EXISTS "totalOrders" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "completedOrders" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "cancelledOrders" INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "rating" DECIMAL(3,2) DEFAULT 0.00,
            ADD COLUMN IF NOT EXISTS "reviewsCount" INTEGER DEFAULT 0;
        `);
        
        console.log('✅ Users table updated with performance metrics!');
        process.exit();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
