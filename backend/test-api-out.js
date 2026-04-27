import * as OrderService from './src/services/order.service.js';
import { connectDB } from './src/config/db.js';

const testApi = async () => {
  try {
    await connectDB();
    const data = await OrderService.getAllRestaurantOrders();
    console.log('--- API DATA ---');
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('API Test Failed:', err);
    process.exit(1);
  }
};

testApi();
