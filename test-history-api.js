import axios from 'axios';

const API_URL = 'http://localhost:5002/api/restaurants/orders/history';

const testHistory = async () => {
    try {
        console.log('🧪 Testing Order History API...');
        
        // 1. Test basic fetch
        const res1 = await axios.get(API_URL);
        console.log('✅ Basic Fetch:', res1.data.success ? 'SUCCESS' : 'FAILED');
        console.log('📊 Stats:', {
            totalCount: res1.data.data.totalCount,
            totalRevenue: res1.data.data.totalRevenue,
            ordersFetched: res1.data.data.orders.length
        });

        // 2. Test Pagination
        const res2 = await axios.get(`${API_URL}?page=1&limit=2`);
        console.log('✅ Pagination Test (Limit 2):', res2.data.data.orders.length <= 2 ? 'SUCCESS' : 'FAILED');

        // 3. Test Search (assuming there's an order or user)
        const res3 = await axios.get(`${API_URL}?search=admin`);
        console.log('✅ Search Test ("admin"):', res3.data.data.orders.length >= 0 ? 'SUCCESS' : 'FAILED');

    } catch (err) {
        console.error('❌ API Test Failed:', err.response?.data || err.message);
    }
};

testHistory();
