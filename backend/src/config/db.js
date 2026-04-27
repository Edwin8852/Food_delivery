import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = requiredEnv.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ CRITICAL: Missing DB environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Database Connected Successfully via Sequelize (Host: ' + process.env.DB_HOST + ')');
    
    // Sync models (in development, use { alter: false } to prevent auto-alter issues)
    // Schema should be managed manually with migrations in production
    await sequelize.sync({ alter: false, force: false });
    console.log('🔄 All systems are synced. 🚀');
  } catch (error) {
    console.error('❌ Database Connection Failure:');
    console.error('   -> Message: ' + error.message);
    throw error;
  }
};

export default sequelize;
