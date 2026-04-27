import pool from './src/config/dbPool.js';

const migrate = async () => {
    try {
        console.log('🚀 Adding financial and work tracking fields to users table...');
        
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS "totalEarnings" DECIMAL(12,2) DEFAULT 0.00,
            ADD COLUMN IF NOT EXISTS "todayEarnings" DECIMAL(10,2) DEFAULT 0.00,
            ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS "shiftStart" TIME,
            ADD COLUMN IF NOT EXISTS "shiftEnd" TIME,
            ADD COLUMN IF NOT EXISTS "fcmToken" VARCHAR(255);
        `);
        
        console.log('✅ Users table updated with financial and attendance metrics!');
        process.exit();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
