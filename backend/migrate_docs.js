import pool from './src/config/dbPool.js';

const migrate = async () => {
    try {
        console.log('🚀 Adding detailed document fields and verification status...');
        
        // Add ENUM type for PostgreSQL if it doesn't exist
        try {
            await pool.query("CREATE TYPE \"enum_users_verificationStatus\" AS ENUM('PENDING', 'APPROVED', 'REJECTED')");
        } catch (e) {
            console.log('--- ENUM type might already exist, skipping creation');
        }

        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS "aadhaarImage" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "licenseImage" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "panNumber" VARCHAR(20),
            ADD COLUMN IF NOT EXISTS "panImage" VARCHAR(255),
            ADD COLUMN IF NOT EXISTS "verificationStatus" "enum_users_verificationStatus" DEFAULT 'PENDING';
        `);
        
        console.log('✅ Users table updated with document tracking!');
        process.exit();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
