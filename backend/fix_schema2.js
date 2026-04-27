import sequelize from './src/config/db.js';
import fs from 'fs';

const fixSchema = async () => {
    const log = [];
    try {
        // 1. Fix total_amount column (INTEGER → DECIMAL)
        await sequelize.query(`
            ALTER TABLE orders 
            ALTER COLUMN total_amount TYPE DECIMAL(10,2) 
            USING total_amount::DECIMAL(10,2)
        `);
        log.push('✅ Converted total_amount from INTEGER to DECIMAL(10,2)');

        // 2. Drop legacy duplicate 'status' column if it exists
        await sequelize.query(`ALTER TABLE orders DROP COLUMN IF EXISTS status`);
        log.push('✅ Dropped legacy "status" column');

        // 3. Drop duplicate updated_at if it exists alongside updatedAt
        await sequelize.query(`ALTER TABLE orders DROP COLUMN IF EXISTS updated_at`);
        log.push('✅ Dropped duplicate updated_at column');

        // 4. Add missing order management columns if not present
        await sequelize.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS payment_method VARCHAR(10) DEFAULT 'COD'
        `);
        log.push('✅ Ensured payment_method column exists');

        await sequelize.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0
        `);
        log.push('✅ Ensured delivery_fee column exists');

        await sequelize.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2) DEFAULT 0
        `);
        log.push('✅ Ensured platform_fee column exists');

        await sequelize.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS order_status VARCHAR(30) DEFAULT 'PLACED'
        `);
        log.push('✅ Ensured order_status column exists');

        log.push('\n🎉 Schema fix complete!');
        fs.writeFileSync('./fix_result.log', log.join('\n'), 'utf8');
        console.log(log.join('\n'));
        process.exit(0);
    } catch (e) {
        log.push('❌ Error: ' + e.message);
        fs.writeFileSync('./fix_result.log', log.join('\n'), 'utf8');
        console.error(e);
        process.exit(1);
    }
}
fixSchema();
