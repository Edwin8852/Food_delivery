import pool from './src/config/dbPool.js';

const upgrade = async () => {
    try {
        console.log('🚀 ADDING is_deleted COLUMN TO addresses TABLE...');
        const query = 'ALTER TABLE addresses ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;';
        await pool.query(query);
        console.log('✅ DATABASE UPDATED SUCCESSFULLY');
        process.exit(0);
    } catch (err) {
        console.error('🔥 ERROR:', err.message);
        process.exit(1);
    }
};

upgrade();
