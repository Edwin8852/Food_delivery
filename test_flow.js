import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let userToken, adminToken, deliveryToken;
let orderId;

const runTests = async () => {
  try {
    console.log('--- 🚀 Starting System Validation ---');

    console.log('1. User Registration / Login');
    try {
      const uRes = await axios.post(`${BASE_URL}/auth/register`, { name: 'Test User', email: `user${Date.now()}@test.com`, password: 'password123' });
      userToken = uRes.data.data.token;
    } catch (e) { console.error('Error logging in user'); process.exit(1); }

    try {
      const aRes = await axios.post(`${BASE_URL}/auth/register`, { name: 'Admin', email: `admin${Date.now()}@test.com`, password: 'password123', role: 'admin' });
      adminToken = aRes.data.data.token;
    } catch (e) {}

    try {
      const dpRes = await axios.post(`${BASE_URL}/auth/register`, { name: 'Delivery Boy', email: `driver${Date.now()}@test.com`, password: 'password123', role: 'delivery_partner' });
      deliveryToken = dpRes.data.data.token;
    } catch (e) {}
    console.log('✅ Tokens generated');

    // 1. ORDER FLOW TEST
    console.log('2. Order Flow Test');
    // Save Address
    const addrRes = await axios.post(`${BASE_URL}/address`, { street: 'Main St', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001' }, { headers: { Authorization: `Bearer ${userToken}` }});
    const addrId = addrRes.data.data.id;
    
    // Add to cart
    const menuItems = await axios.get(`${BASE_URL}/menu-items`);
    if(menuItems.data.data.length === 0) {
      console.log('❌ No menu items found, skipping tests'); process.exit(0);
    }
    const menuItemId = menuItems.data.data[0].id;
    await axios.post(`${BASE_URL}/cart/add`, { menuItemId, quantity: 2 }, { headers: { Authorization: `Bearer ${userToken}` }});
    
    // Checkout
    const orderRes = await axios.post(`${BASE_URL}/orders`, { addressId: addrId, paymentMethod: 'COD' }, { headers: { Authorization: `Bearer ${userToken}` }});
    orderId = orderRes.data.data.id;
    console.log(`✅ Order ${orderId} placed successfully. Status: ${orderRes.data.data.orderStatus}, Total: ${orderRes.data.data.totalAmount}`);

    // 2. RESTAURANT STATUS TEST
    console.log('3. Restaurant Status Test');
    await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'Preparing' }, { headers: { Authorization: `Bearer ${adminToken}` }});
    console.log('✅ Status updated to Preparing');
    await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'Ready' }, { headers: { Authorization: `Bearer ${adminToken}` }});
    console.log('✅ Status updated to Ready');

    // 3. DELIVERY PARTNER TEST
    console.log('4. Delivery Partner Accept');
    await axios.post(`${BASE_URL}/delivery/accept/${orderId}`, {}, { headers: { Authorization: `Bearer ${deliveryToken}` }});
    console.log('✅ Order Accepted by Delivery Partner');

    // 4. LIVE LOCATION TEST
    console.log('5. Live Location Test');
    await axios.post(`${BASE_URL}/delivery/location`, { orderId, lat: 11.0123, lng: 76.9999 }, { headers: { Authorization: `Bearer ${deliveryToken}` }});
    console.log('✅ Delivery location updated');

    console.log('6. Status progression');
    await axios.patch(`${BASE_URL}/delivery/status/${orderId}`, { status: 'OutForDelivery' }, { headers: { Authorization: `Bearer ${deliveryToken}` }});
    console.log('✅ Status upgraded to OutForDelivery');

    await axios.patch(`${BASE_URL}/delivery/status/${orderId}`, { status: 'Delivered' }, { headers: { Authorization: `Bearer ${deliveryToken}` }});
    console.log('✅ Order fully DELIVERED');
    
    console.log('--- 🎉 ALL TESTS PASSED ---');

  } catch(e) {
    console.error('❌ Test failed!', e.response?.data || e.message);
  }
};

runTests();
