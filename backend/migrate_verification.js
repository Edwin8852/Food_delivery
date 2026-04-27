import pool from './src/config/dbPool.js';

const migrate = async () => {
    try {
        console.log('🚀 Altering users table to add verification fields...');
        
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS "profileImage" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "aadhaarNumber" VARCHAR(20),
            ADD COLUMN IF NOT EXISTS "licenseNumber" VARCHAR(50),
            ADD COLUMN IF NOT EXISTS "vehicleNumber" VARCHAR(20),
            ADD COLUMN IF NOT EXISTS "vehicleType" VARCHAR(20),
            ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP WITH TIME ZONE;
        `);
        
        console.log('✅ Users table updated successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
