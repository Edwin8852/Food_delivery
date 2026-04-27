import { Order } from './src/models/index.js';
import { connectDB } from './src/config/db.js';

const checkOrders = async () => {
  try {
    await connectDB();
    const orders = await Order.findAll();
    console.log('--- ORDERS IN DATABASE ---');
    console.log(JSON.stringify(orders, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    process.exit(1);
  }
};

checkOrders();
