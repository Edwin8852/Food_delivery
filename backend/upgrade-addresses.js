import pool from './src/config/dbPool.js';

const upgradeTable = async () => {
    try {
        console.log('🚀 INITIALIZING SCHEMA UPGRADE...');
        
        // 1. Alter Table logic
        const query = `
            ALTER TABLE addresses 
            ADD COLUMN IF NOT EXISTS title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS street1 TEXT,
            ADD COLUMN IF NOT EXISTS street2 TEXT,
            ADD COLUMN IF NOT EXISTS landmark TEXT,
            ADD COLUMN IF NOT EXISTS city TEXT,
            ADD COLUMN IF NOT EXISTS state TEXT,
            ADD COLUMN IF NOT EXISTS postal_code TEXT,
            ADD COLUMN IF NOT EXISTS contact_name TEXT,
            ADD COLUMN IF NOT EXISTS contact_number TEXT,
            ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
        `;
        
        await pool.query(query);
        console.log('✅ SCHEMA UPGRADED SUCCESSFULLY TO ADOBE-RETAIL SPEC');
        process.exit(0);
    } catch (err) {
        console.error('🔥 CRITICAL ERROR DURING UPGRADE:', err.message);
        process.exit(1);
    }
};

upgradeTable();
