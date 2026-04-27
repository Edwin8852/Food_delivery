import { Order } from './src/models/index.js';
import { assignDelivery } from './src/services/order.service.js';

const test = async () => {
    try {
        const orderId = '8b97edea-86ee-462d-a684-eddc8834e7fe';
        const riderId = '548122e1-5f18-4769-9bd9-fb40244b1f55';
        
        console.log('Testing manual assignment...');
        const result = await assignDelivery(orderId, riderId);
        console.log('Assignment successful. Result status:', result.orderStatus);
        
        const fresh = await Order.findByPk(orderId);
        console.log('Fresh fetch from DB:');
        console.log('orderStatus:', fresh.orderStatus);
        console.log('deliveryPartnerId:', fresh.deliveryPartnerId);
        
        process.exit();
    } catch (err) {
        console.error('Assignment failed:', err);
        process.exit(1);
    }
};

test();
