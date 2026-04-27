import sequelize from './src/config/db.js';

/**
 * Migration script to fix NULL timestamp values
 * Run: node fix-timestamps.js
 */
const fixTimestamps = async () => {
  const client = await sequelize.getQueryInterface();
  
  try {
    console.log('🔄 Starting timestamp fix migration...\n');

    // Fix users table
    console.log('📝 Fixing users table timestamps...');
    await sequelize.query(`
      UPDATE users
      SET created_at = CURRENT_TIMESTAMP
      WHERE created_at IS NULL;
    `);
    await sequelize.query(`
      UPDATE users
      SET updated_at = CURRENT_TIMESTAMP
      WHERE updated_at IS NULL;
    `);

    // Fix other tables
    const tables = ['restaurants', 'foods', 'addresses', 'orders', 'reviews'];
    for (const table of tables) {
      console.log(`📝 Fixing ${table} table timestamps...`);
      await sequelize.query(`
        UPDATE ${table}
        SET created_at = CURRENT_TIMESTAMP
        WHERE created_at IS NULL;
      `);
    }

    // Add NOT NULL constraints
    console.log('\n🔒 Adding NOT NULL constraints...');
    await sequelize.query(`
      ALTER TABLE users 
      ALTER COLUMN created_at SET NOT NULL,
      ALTER COLUMN updated_at SET NOT NULL;
    `);

    // Verify
    console.log('\n✅ Verification:');
    const [result] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_createdAt,
        COUNT(CASE WHEN updated_at IS NULL THEN 1 END) as null_updatedAt
      FROM users;
    `);
    console.log(result[0]);

    if (result[0].null_createdAt === 0 && result[0].null_updatedAt === 0) {
      console.log('\n✅ Migration completed successfully! All timestamps fixed.');
    } else {
      console.warn('⚠️  Some NULL values remain.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

fixTimestamps();
