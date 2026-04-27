import { Order, OrderItem, Cart, MenuItem, Address, User, Restaurant, Settings } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import { CustomError } from '../shared/error-handling/customError.js';
import { emitNewOrder, emitOrderStatusUpdate, emitNewDeliveryOrder, emitOrderAssigned } from '../socket.js';

const getGlobalSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      can_accept: true, can_pickup: true, can_deliver: true, max_active_orders: 3, theme: 'light'
    });
  }
  return settings;
};

const validateRiderAction = async (riderId, actionType) => {
  const settings = await getGlobalSettings();
  
  // 🛡️ Global Flag Check
  if (actionType === 'ACCEPT' && !settings.can_accept) throw new CustomError('Order acceptance is globally disabled by HQ.', 403);
  if (actionType === 'PICKUP' && !settings.can_pickup) throw new CustomError('Pickups are currently suspended globally.', 403);
  if (actionType === 'DELIVERY' && !settings.can_deliver) throw new CustomError('Final delivery confirmation is currently disabled.', 403);

  // 📦 Capacity Constraint Check
  if (riderId && (actionType === 'ACCEPT' || actionType === 'ASSIGN')) {
    const activeCount = await Order.count({
      where: {
        deliveryPartnerId: riderId,
        orderStatus: { [Op.in]: ['ASSIGNED', 'RIDER_CONFIRMED', 'PICKED_UP'] }
      }
    });

    if (activeCount >= settings.max_active_orders) {
      throw new CustomError(`Mission Limit Reached: Clear existing ${activeCount} active missions first.`, 403);
    }
  }
};

export const placeOrder = async (userId, data) => {
  const { addressId, paymentMethod, couponId, discountAmount = 0 } = data;
  const transaction = await sequelize.transaction();

  try {
    // 🛒 Get cart items with menuItem
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        { model: MenuItem, as: 'menuItem' }
      ]
    });

    if (!cartItems || cartItems.length === 0) {
      throw new CustomError('Your cart is empty', 400);
    }

    // ✅ Check address & Update last used timestamp
    const address = await Address.findByPk(addressId);
    if (!address) {
      throw new CustomError('Invalid address selection', 400);
    }
    
    await address.update({ lastUsedAt: new Date() }, { transaction });

    // 🧮 Calculate total
    let itemsTotal = 0;

    for (let item of cartItems) {
      if (!item.menuItem) {
        throw new CustomError('Menu item data missing (association error)', 500);
      }
      itemsTotal += parseFloat(item.menuItem.price || 0) * item.quantity;
    }

    // 💰 High-Fidelity Fees (Synchronized with Frontend UI)
    const platformFee = 12; // Taxes/Processing
    const deliveryFee = 40; // Standard Delivery

    const finalTotal = itemsTotal + platformFee + deliveryFee - parseFloat(discountAmount);

    // 💳 Payment
    const paymentStatus = 'pending'; 

    const restaurantId = cartItems[0].menuItem.restaurantId;

    // 🧾 Create order
    const order = await Order.create({
      userId,
      restaurantId,
      addressId,
      totalAmount: finalTotal,
      deliveryFee,
      platformFee,
      couponId,
      discountAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: 'PLACED'
    }, { transaction });

    // 📦 Create order items
    const orderItems = cartItems.map(item => ({
      orderId: order.id,
      foodId: item.menuItemId,
      quantity: item.quantity,
      name: item.menuItem.name,
      code: item.menuItem.code,
      priceAtTime: parseFloat(item.menuItem.price) || 0,
      price_at_time: parseFloat(item.menuItem.price) || 0
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    // 🧹 Clear cart
    await Cart.destroy({ where: { userId }, transaction });

    await transaction.commit();
    
    const finalOrder = await getOrderById(order.id);
    emitNewOrder(restaurantId, finalOrder);

    return finalOrder;

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("🔥 ORDER ERROR:", error);
    throw error;
  }
};


export const getUserOrders = async (userId) => {
  return await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: MenuItem, as: 'menuItem' }]
      },
      { model: Address, as: 'address' }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: MenuItem, as: 'menuItem' }]
      },
      { model: Address, as: 'address' },
      { model: Restaurant, as: 'restaurant' },
      { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
      { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'phone'] }
    ]
  });
  if (!order) throw new CustomError('Order not found', 404);
  return order;
};

export const updateStatus = async (orderId, status, deliveryPartnerId = null) => {
  // Central dispatcher for all status updates
  if (status === 'ACCEPTED') return await acceptOrder(orderId);
  if (status === 'IN_KITCHEN') return await sendToKitchen(orderId);
  if (status === 'PREPARING') return await markPreparing(orderId);
  if (status === 'READY') return await markOrderReady(orderId);
  if (status === 'ASSIGNED') return await assignDelivery(orderId, deliveryPartnerId);
  if (status === 'PICKED_UP') return await markPickedUp(orderId);
  if (status === 'DELIVERED') return await markDelivered(orderId);

  // Default generic update
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  order.orderStatus = status;
  await order.save();
  
  emitOrderStatusUpdate(orderId, status);
  emitNewOrder(order.restaurantId, order); 

  return order;
};

export const processPayment = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  
  if (order.paymentStatus === 'paid') {
    throw new CustomError('Order is already paid', 400);
  }

  order.paymentStatus = 'paid';
  if (order.orderStatus === 'PENDING' || order.orderStatus === 'PLACED') {
    // Keep it as PLACED or transition to next? 
    // Usually payment doesn't change the restaurant flow until delivery
  }
  
  await order.save();
  return order;
};

// ----- RESTAURANT ADMIN ACTIONS ----- //

export const getAllRestaurantOrders = async () => {
  return await Order.findAll({
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: MenuItem, as: 'menuItem' }]
      },
      { model: Address, as: 'address' },
      { model: User, as: 'customer', attributes: ['id', 'name', 'phone', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const acceptOrder = async (orderId, userId = null) => {
  console.log(`[LOG] Accepting Order: ${orderId} | User: ${userId}`);
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  
  const user = userId ? await User.findByPk(userId) : null;
  
  if (user && user.role === 'DELIVERY_PARTNER') {
    // 🏍️ Rider is accepting
    await validateRiderAction(user.id, 'ACCEPT');
    order.deliveryPartnerId = user.id;
    order.orderStatus = 'RIDER_CONFIRMED';
    
    // Update partner busy state
    user.isBusy = true;
    user.currentOrderId = orderId;
    await user.save();
  } else {
    // 👨‍🍳 Restaurant is accepting the incoming order
    order.orderStatus = 'ACCEPTED';
  }

  await order.save();
  
  // 📣 Notify user and admin
  emitOrderStatusUpdate(orderId, order.orderStatus);
  emitNewOrder(order.restaurantId, order);
  
  console.log(`✅ Order ${orderId} status changed to ${order.orderStatus}`);
  return await getOrderById(orderId);
};


export const sendToKitchen = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  order.orderStatus = 'IN_KITCHEN';
  await order.save();
  
  // 📣 Notify User & Admin (Kitchen update)
  emitOrderStatusUpdate(orderId, 'IN_KITCHEN');
  emitNewOrder(order.restaurantId, order); 
  
  return await getOrderById(orderId);
};

export const markPreparing = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  order.orderStatus = 'PREPARING';
  await order.save();
  
  emitOrderStatusUpdate(orderId, 'PREPARING');
  emitNewOrder(order.restaurantId, order);
  
  return await getOrderById(orderId);
};

export const markOrderReady = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: User, as: 'customer', attributes: ['id', 'name'] }]
  });
  if (!order) throw new CustomError('Order not found', 404);
  
  order.orderStatus = 'READY';
  await order.save();
  
  // 📣 Notify User, Admin, and Rider Pool
  emitOrderStatusUpdate(orderId, 'READY');
  emitNewOrder(order.restaurantId, order);
  emitNewDeliveryOrder(order);
  
  return order;
};


export const assignDelivery = async (orderId, deliveryPartnerId) => {
  console.log(`[LOG] Assigning Delivery Partner ${deliveryPartnerId} to Order ${orderId}`);
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  
  if (!deliveryPartnerId) {
    throw new CustomError('Delivery Partner ID is required for assignment', 400);
  }

  await validateRiderAction(deliveryPartnerId, 'ASSIGN');
  order.deliveryPartnerId = deliveryPartnerId;
  order.orderStatus = 'ASSIGNED'; 
  await order.save();

  // Update Rider Operational State
  const partner = await User.findByPk(deliveryPartnerId);
  if (partner) {
    partner.isBusy = true;
    partner.currentOrderId = orderId;
    await partner.save();
    console.log(`✅ Rider ${partner.name} is now busy on order ${orderId}`);
  }
  
  // 📣 Notify ALL: User, Admin, Rider
  emitOrderStatusUpdate(orderId, 'ASSIGNED');
  emitOrderAssigned(orderId, deliveryPartnerId, await getOrderById(orderId));
  emitNewOrder(order.restaurantId, order);
  
  return await getOrderById(orderId);
};


export const markPickedUp = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  
  await validateRiderAction(order.deliveryPartnerId, 'PICKUP');
  
  order.orderStatus = 'PICKED_UP';
  await order.save();
  
  emitOrderStatusUpdate(orderId, 'PICKED_UP');
  emitNewOrder(order.restaurantId, order);
  
  return await getOrderById(orderId);
};

export const markOutForDelivery = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  order.orderStatus = 'OUT_FOR_DELIVERY';
  await order.save();
  
  emitOrderStatusUpdate(orderId, 'OUT_FOR_DELIVERY');
  emitNewOrder(order.restaurantId, order);
  
  return await getOrderById(orderId);
};


export const markDelivered = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);

  await validateRiderAction(order.deliveryPartnerId, 'DELIVERY');

  order.orderStatus = 'DELIVERED';
  await order.save();

  // Reset Rider State and Update Financials
  if (order.deliveryPartnerId) {
    const partner = await User.findByPk(order.deliveryPartnerId);
    if (partner) {
      partner.isBusy = false;
      partner.currentOrderId = null;
      partner.completedOrders += 1;
      
      // Calculate Payout Logic
      const payout = 50; 
      partner.todayEarnings = Number(partner.todayEarnings || 0) + payout;
      partner.totalEarnings = Number(partner.totalEarnings || 0) + payout;
      partner.wallet = Number(partner.wallet || 0) + payout;
      
      await partner.save();
    }
  }
  
  // 📣 Final Notification for ALL
  emitOrderStatusUpdate(orderId, 'DELIVERED');
  emitNewOrder(order.restaurantId, order);
  
  return await getOrderById(orderId);
};


export const getOrderHistory = async (queryParams) => {
  const { page = 1, limit = 10, search = '', dateFilter = 'all' } = queryParams;
  const offset = (page - 1) * parseInt(limit);

  const where = {
    orderStatus: {
      [Op.in]: ['DELIVERED', 'Delivered', 'CANCELLED']
    }
  };

  // Search Logic
  if (search) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search);
    
    where[Op.or] = [
      { '$customer.name$': { [Op.iLike]: `%${search}%` } }
    ];

    if (isUuid) {
      where[Op.or].push({ id: search });
    }
  }

  // Date Logic
  const now = new Date();
  if (dateFilter === 'today') {
    const start = new Date(new Date().setHours(0,0,0,0));
    where.createdAt = { [Op.gte]: start };
  } else if (dateFilter === 'week') {
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    where.createdAt = { [Op.gte]: lastWeek };
  } else if (dateFilter === 'month') {
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    where.createdAt = { [Op.gte]: lastMonth };
  }

  const { count, rows: orders } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
      { model: OrderItem, as: 'items' },
      { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'phone'] }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
    distinct: true
  });

  const totalRevenue = await Order.sum('totalAmount', { 
    where: { 
      ...where, 
      orderStatus: { [Op.in]: ['DELIVERED', 'Delivered'] }
    },
    include: [{ model: User, as: 'customer', attributes: [] }] // Must include User for the name filter to work
  });

  return {
    orders,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    totalRevenue: parseFloat(totalRevenue || 0)
  };
};

export const addRating = async (orderId, rating, review) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  
  order.rating = rating;
  order.review = review;
  await order.save();
  return order;
};

export const unassignOrder = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new CustomError('Order not found', 404);
  
  if (!['ASSIGNED', 'RIDER_CONFIRMED'].includes(order.orderStatus)) {
    throw new CustomError('Order is not in a reversible assignment state', 400);
  }

  const prevPartnerId = order.deliveryPartnerId;
  
  order.deliveryPartnerId = null;
  order.orderStatus = 'READY'; 
  await order.save();

  if (prevPartnerId) {
    const partner = await User.findByPk(prevPartnerId);
    if (partner) {
      partner.isBusy = false;
      partner.currentOrderId = null;
      await partner.save();
    }
  }

  emitOrderStatusUpdate(orderId, 'READY');
  emitNewOrder(order.restaurantId, order);
  
  return await getOrderById(orderId);
};

export const removeLastAssignment = async () => {
  const lastAssignedOrder = await Order.findOne({
    where: { 
      orderStatus: { [Op.in]: ['ASSIGNED', 'RIDER_CONFIRMED'] }
    },
    order: [['updatedAt', 'DESC']]
  });

  if (!lastAssignedOrder) {
    throw new CustomError('No recently assigned missions found in the grid.', 404);
  }

  return await unassignOrder(lastAssignedOrder.id);
};