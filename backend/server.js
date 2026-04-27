import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectDB } from './src/config/db.js';
import { initSocket } from './src/socket.js';

let PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Start server only if database connection is successful
const startServer = async () => {
  console.log('🔄 Application Starting...');
  try {
    console.log('📡 Attempting to connect to the database...');
    await connectDB();
    
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ CRITICAL ERROR: Port ${PORT} is already in use! Please kill the process using this port before restarting.`);
        process.exit(1);
      } else {
        console.error('❌ Server Error:', error);
        process.exit(1);
      }
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server fully operational on port ${PORT}`);
      console.log(`🔗 Local interface: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ CRITICAL ERROR: The server could not start because the database connection failed.');
    console.error('   Please verify the [food_delivery] database, PostgreSQL service status, and .env credentials.');
    process.exit(1);
  }
};

startServer();
