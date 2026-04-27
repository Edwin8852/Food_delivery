import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clear old src directory
fs.rmSync(path.join(__dirname, 'src'), { recursive: true, force: true });

// Create new folder tree
const dirs = [
  'src/config',
  'src/models/initmodels',
  'src/modules/home/controllers',
  'src/modules/home/model',
  'src/modules/home/routes',
  'src/modules/home/services',
  'shared/middleware',
  'shared/auth',
  'shared/errorhandling'
];

const moduleNames = ['user', 'restaurant', 'food', 'order'];

moduleNames.forEach(mod => {
  dirs.push(`src/modules/${mod}/controllers`);
  dirs.push(`src/modules/${mod}/model`);
  dirs.push(`src/modules/${mod}/routes`);
  dirs.push(`src/modules/${mod}/services`);
});

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

// Recreate Files
const files = {
  'src/config/db.js': "import pg from 'pg';\nimport dotenv from 'dotenv';\ndotenv.config();\nconst { Pool } = pg;\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\nexport const connectDB = async () => {\n  try { await pool.connect(); console.log('PostgreSQL connected'); }\n  catch (error) { console.error('PostgreSQL Connection Error:', error); throw error; }\n};\nexport const query = (text, params) => pool.query(text, params);\n",

  'src/models/initmodels/index.js': "// Initialize and relate all models here if using an ORM like Sequelize.\nexport const syncModels = async () => {\n  console.log('Models synchronized');\n};\n",

  'shared/errorhandling/customError.js': "export class CustomError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n  }\n}\n",

  'shared/errorhandling/errorHandler.js': "export const errorHandler = (err, req, res, next) => {\n  const statusCode = err.statusCode || 500;\n  res.status(statusCode).json({ success: false, message: err.message || 'Server Error' });\n};\n",

  'shared/auth/jwt.js': "import jwt from 'jsonwebtoken';\nexport const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });\nexport const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);\n",

  'shared/middleware/auth.middleware.js': "import { verifyToken } from '../auth/jwt.js';\nimport { CustomError } from '../errorhandling/customError.js';\nexport const protect = (req, res, next) => {\n  let token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;\n  if (!token) return next(new CustomError('Not authorized', 401));\n  try { req.user = verifyToken(token); next(); } catch (err) { next(new CustomError('Token failed', 401)); }\n};\n",

  'shared/middleware/logger.middleware.js': "export const loggerMiddleware = (req, res, next) => { console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`); next(); };\n",
  
  // App Config update
  'app.js': "import express from 'express';\nimport cors from 'cors';\nimport dotenv from 'dotenv';\nimport { errorHandler } from './shared/errorhandling/errorHandler.js';\nimport { loggerMiddleware } from './shared/middleware/logger.middleware.js';\n\nimport homeRoutes from './src/modules/home/routes/home.routes.js';\nimport userRoutes from './src/modules/user/routes/user.routes.js';\nimport restaurantRoutes from './src/modules/restaurant/routes/restaurant.routes.js';\nimport foodRoutes from './src/modules/food/routes/food.routes.js';\nimport orderRoutes from './src/modules/order/routes/order.routes.js';\n\ndotenv.config();\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\napp.use(loggerMiddleware);\n\napp.use('/api/', homeRoutes);\napp.use('/api/users', userRoutes);\napp.use('/api/restaurants', restaurantRoutes);\napp.use('/api/food', foodRoutes);\napp.use('/api/orders', orderRoutes);\n\napp.use(errorHandler);\n\nexport default app;\n",

  'server.js': "import app from './app.js';\nimport dotenv from 'dotenv';\nimport { connectDB } from './src/config/db.js';\nimport { syncModels } from './src/models/initmodels/index.js';\n\ndotenv.config();\nconst PORT = process.env.PORT || 5000;\n\nconnectDB().then(async () => {\n  await syncModels();\n  app.listen(PORT, () => {\n    console.log(`Server running on port ${PORT}`);\n  });\n}).catch(err => {\n  console.error('Failed to connect to database', err);\n  process.exit(1);\n});\n"
};

// Modules Generation
const mods = ['home', ...moduleNames];

mods.forEach(mod => {
  const cap = mod.charAt(0).toUpperCase() + mod.slice(1);
  const isHome = mod === 'home';

  // Model
  files[`src/modules/${mod}/model/${mod}.model.js`] = isHome 
    ? `export const getHomeStats = async () => ({ users: 0, restaurants: 0, orders: 0 });\n`
    : `import { query } from '../../../config/db.js';\nexport const findAll${cap}s = async () => {\n  const res = await query('SELECT * FROM ${mod}s');\n  return res.rows;\n};\n`;

  // Service
  files[`src/modules/${mod}/services/${mod}.service.js`] = isHome
    ? `import * as HomeModel from '../model/home.model.js';\nexport const getDashStats = async () => await HomeModel.getHomeStats();\n`
    : `import * as ${cap}Model from '../model/${mod}.model.js';\nexport const getAll${cap}s = async () => await ${cap}Model.findAll${cap}s();\n`;

  // Controller
  files[`src/modules/${mod}/controllers/${mod}.controller.js`] = isHome
    ? `import * as HomeService from '../services/home.service.js';\nexport const getHomePage = async (req, res) => {\n  const stats = await HomeService.getDashStats();\n  res.json({ success: true, message: 'Welcome to Food Delivery API', stats });\n};\n`
    : `import * as ${cap}Service from '../services/${mod}.service.js';\nexport const get${cap}s = async (req, res, next) => {\n  try {\n    const data = await ${cap}Service.getAll${cap}s();\n    res.status(200).json({ success: true, data });\n  } catch (error) {\n    next(error);\n  }\n};\n`;

  // Routes
  files[`src/modules/${mod}/routes/${mod}.routes.js`] = isHome
    ? `import express from 'express';\nimport { getHomePage } from '../controllers/home.controller.js';\nconst router = express.Router();\nrouter.get('/', getHomePage);\nexport default router;\n`
    : `import express from 'express';\nimport { get${cap}s } from '../controllers/${mod}.controller.js';\nimport { protect } from '../../../../shared/middleware/auth.middleware.js';\nconst router = express.Router();\nrouter.get('/', protect, get${cap}s);\nexport default router;\n`;
});

Object.keys(files).forEach(f => {
  fs.writeFileSync(path.join(__dirname, f), files[f]);
});

console.log('Refactoring to Module-Based Architecture complete.');
