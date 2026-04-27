import sequelize from './src/config/db.js';
const fixSchema = async () => {
    try {
        console.log('🔄 Fixing orders table schema mismatches...');
        
        // 1. Convert delivery_partner_id to UUID (Safely)
        // Note: If there's data, this might fail unless we clear it or cast.
        // We will TRY TO ALTER TYPE. Use USING for casting if possible.
        // But since they were integers, they likely contain IDs like 1, 2, 3... which are NOT valid UUIDs.
        // So we will drop and recreate or clear the column if it's currently unusable.
        
        await sequelize.query('ALTER TABLE orders DROP COLUMN IF EXISTS delivery_partner_id;');
        await sequelize.query('ALTER TABLE orders ADD COLUMN delivery_partner_id UUID;');
        console.log('✅ Recreated delivery_partner_id as UUID');

        // 2. Fix amount columns (DECIMAL)
        await sequelize.query('ALTER TABLE orders ALTER COLUMN total_price TYPE DECIMAL(10,2);');
        await sequelize.query('ALTER TABLE orders ALTER COLUMN delivery_fee TYPE DECIMAL(10,2);');
        await sequelize.query('ALTER TABLE orders ALTER COLUMN platform_fee TYPE DECIMAL(10,2);');
        console.log('✅ Fixed amount columns to DECIMAL');

        process.exit(0);
    } catch (e) {
        console.error('❌ Schema Fix Failed:', e);
        process.exit(1);
    }
}
fixSchema();
