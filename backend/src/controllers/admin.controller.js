import { Order, User, Restaurant, OrderItem, MenuItem, Address } from '../models/index.js';
import { Op } from 'sequelize';
import * as OrderService from '../services/order.service.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const totalDelivered = await Order.count({ where: { orderStatus: ['DELIVERED', 'Delivered'] } });
    const totalUsers = await User.count({ where: { role: 'USER' } });
    const totalRevenue = await Order.sum('totalAmount', { where: { orderStatus: ['DELIVERED', 'Delivered'] } });
    
    // Today's Stats
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const ordersToday = await Order.count({ 
      where: { 
        createdAt: { [Op.gte]: todayStart } 
      } 
    });

    // Pipeline Statuses (Synchronized with Operative States)
    const statusCounts = {
      placed: await Order.count({ where: { orderStatus: ['PLACED', 'PENDING'] } }),
      accepted: await Order.count({ where: { orderStatus: 'ACCEPTED' } }),
      kitchen: await Order.count({ where: { orderStatus: ['IN_KITCHEN', 'PREPARING'] } }),
      ready: await Order.count({ where: { orderStatus: 'READY' } }),
      assigned: await Order.count({ where: { orderStatus: ['ASSIGNED', 'RIDER_CONFIRMED'] } }),
      picked: await Order.count({ where: { orderStatus: ['PICKED_UP', 'OUT_FOR_DELIVERY'] } })
    };

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        ordersToday,
        totalDelivered,
        totalUsers,
        totalRevenue: parseFloat(totalRevenue || 0),
        statusCounts
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'deliveryPartner', attributes: ['id', 'name', 'phone'] },
        { model: Address, as: 'address' },
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status, deliveryPartnerId } = req.body;
    const data = await OrderService.updateStatus(orderId, status, deliveryPartnerId);

    res.status(200).json({ success: true, message: 'Order status updated', data });
  } catch (error) {
    next(error);
  }
};

export const unassignOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const data = await OrderService.unassignOrder(orderId);
    res.status(200).json({ success: true, message: 'Rider unassigned successfully', data });
  } catch (error) {
    next(error);
  }
};

export const removeLastAssignment = async (req, res, next) => {
  try {
    const data = await OrderService.removeLastAssignment();
    res.status(200).json({ success: true, message: 'Last assignment reversed', data });
  } catch (error) {
    next(error);
  }
};
export const getDrivers = async (req, res, next) => {
  try {
    const drivers = await User.findAll({
      where: { 
        role: { [Op.in]: ['DELIVERY_PARTNER', 'DELIVERY'] }
      },
      attributes: ['id', 'name', 'phone', 'isOnline', 'isBusy', 'vehicleType', 'vehicleNumber', 'verificationStatus', 'rating', 'completedOrders', 'currentOrderId', 'aadhaarImage', 'licenseImage', 'panImage', 'panNumber']
    });
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    next(error);
  }
};
