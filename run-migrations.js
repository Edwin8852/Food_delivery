import { connectDB } from './src/config/db.js';
import sequelize from './src/config/db.js';

const runMigrations = async () => {
  try {
    await connectDB();
    
    // Add code column to foods
    await sequelize.query('ALTER TABLE foods ADD COLUMN IF NOT EXISTS code VARCHAR(20);');
    console.log('✅ Added code column to foods table');

    // Make sure order_items has code and name
    await sequelize.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS code VARCHAR(20);');
    await sequelize.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name VARCHAR(150);');
    console.log('✅ Added code and name to order_items table');
    
    // Create delivery partners table if not exists (using raw query just in case model sync skips it)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS delivery_partners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        is_available BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created delivery_partners table');

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigrations();
