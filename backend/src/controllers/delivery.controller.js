import { Order, OrderItem, MenuItem, User, Address, Restaurant } from '../models/index.js';
import * as OrderService from '../services/order.service.js';
import { emitOrderStatusUpdate, emitLocationUpdate } from '../socket.js';
import { CustomError } from '../shared/error-handling/customError.js';
import { Op } from 'sequelize';

export const getProfile = async (req, res, next) => {
  try {
    // 🛡️ User.findByPk uses the ID from the protect middleware
    const profile = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!profile) {
      console.warn(`⚠️ Profile extraction failed for ID: ${req.user.id}`);
      return res.status(404).json({ 
        success: false, 
        message: "Identity core not found in logistics grid" 
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('🔥 [Delivery Controller] Profile Fetch Error:', error);
    next(error);
  }
};


export const getAssignedOrders = async (req, res, next) => {
  console.log(`[LOG] Fetching orders for Rider ${req.user.id}`);
  try {
    const data = await Order.findAll({
      where: {
        deliveryPartnerId: req.user.id,
        orderStatus: {
          [Op.in]: ['ACCEPTED', 'READY', 'ASSIGNED', 'RIDER_CONFIRMED', 'PICKED_UP', 'OUT_FOR_DELIVERY']
        }
      },
      include: [

        { model: Address, as: 'address' },
        { model: Restaurant, as: 'restaurant' },
        { model: User, as: 'customer', attributes: ['name', 'phone', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: MenuItem, as: 'menuItem' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


export const markPickedUp = async (req, res, next) => {
  try {
    const data = await OrderService.markPickedUp(req.params.id);
    res.status(200).json({ success: true, message: 'Order picked up successfully', data });
  } catch (error) {
    next(error);
  }
};

export const markOutForDelivery = async (req, res, next) => {
  try {
    const data = await OrderService.markOutForDelivery(req.params.id);
    res.status(200).json({ success: true, message: 'Order is now out for delivery', data });
  } catch (error) {
    next(error);
  }
};

export const markDelivered = async (req, res, next) => {
  try {
    const data = await OrderService.markDelivered(req.params.id);
    res.status(200).json({ success: true, message: 'Order delivered successfully! ₹50 credited to wallet.', data });
  } catch (error) {
    next(error);
  }
};


export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'paid' or 'pending'
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new CustomError('Order not found', 404);
    
    order.paymentStatus = status || 'paid';
    await order.save();
    
    res.status(200).json({ success: true, message: 'Payment status updated', data: order });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const data = await OrderService.acceptOrder(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Order Accepted & Assigned to you', data });
  } catch (error) {
    next(error);
  }
};

export const rejectOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new CustomError('Order not found', 404);
    
    order.orderStatus = 'REJECTED';
    order.deliveryPartnerId = null;
    await order.save();
    
    emitOrderStatusUpdate(order.id, 'REJECTED');
    res.status(200).json({ success: true, message: 'Order Rejected', data: order });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const data = await Order.findAll({
      where: {
        deliveryPartnerId: req.user.id,
        orderStatus: 'DELIVERED'
      },
      include: [
        { model: Address, as: 'address' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getEarnings = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new CustomError('Identity core not found', 404);

    res.status(200).json({ 
      success: true, 
      count: user.completedOrders || 0, 
      total: user.totalEarnings || 0,
      today: user.todayEarnings || 0,
      wallet: user.wallet || 0
    });
  } catch (error) {
    next(error);
  }
};


export const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    await User.update({ lat, lng }, { where: { id: req.user.id } });
    
    // If delivery partner is active on an order, emit location update
    const activeOrder = await Order.findOne({
       where: {
         deliveryPartnerId: req.user.id,
         orderStatus: 'PICKED_UP'
       }
    });
    
    if (activeOrder) {
       emitLocationUpdate(activeOrder.id, lat, lng);
    }

    res.status(200).json({ success: true, message: "Location updated" });
  } catch (error) {
    next(error);
  }
};

export const updateOnlineStatus = async (req, res, next) => {
  try {
    const { isOnline } = req.body;

    if (isOnline) {
      const user = await User.findByPk(req.user.id);
      if (user.verificationStatus !== 'APPROVED') {
        throw new CustomError('Handshake Denied: Identity core not yet approved by Command Center.', 403);
      }
    }

    await User.update({ isOnline }, { where: { id: req.user.id } });
    res.status(200).json({ success: true, message: `Status updated to ${isOnline ? 'Online' : 'Offline'}` });
  } catch (error) {
    next(error);
  }
};

export const uploadDocuments = async (req, res, next) => {
  try {
    console.log('📦 Files:', req.files);
    console.log('📝 Body:', req.body);

    const { 
      aadhaarNumber, aadhaar_number,
      licenseNumber, license_number,
      panNumber, pan_number,
      vehicleNumber, vehicle_number,
      vehicleType, vehicle_type
    } = req.body;

    const updates = {
      aadhaarNumber: aadhaarNumber || aadhaar_number,
      licenseNumber: licenseNumber || license_number,
      panNumber: panNumber || pan_number,
      vehicleNumber: vehicleNumber || vehicle_number,
      vehicleType: vehicleType || vehicle_type,
      verificationStatus: 'PENDING'
    };

    if (req.files) {
      if (req.files.aadhaar_image) updates.aadhaarImage = `/uploads/docs/${req.files.aadhaar_image[0].filename}`;
      if (req.files.license_image) updates.licenseImage = `/uploads/docs/${req.files.license_image[0].filename}`;
      if (req.files.pan_image) updates.panImage = `/uploads/docs/${req.files.pan_image[0].filename}`;
    }

    const user = await User.findByPk(req.user.id);
    if (!user) throw new CustomError('Identity core not found', 404);

    // 🔥 Update profile and set isVerified to true (as per requirement for state reflection)
    await user.update({ ...updates, isVerified: true });
    
    // Refresh log to confirm grid sync
    console.log(`✅ Identity Grid Synchronized for user: ${user.name}`);

    res.status(200).json({ 
      success: true, 
      message: 'Documents uploaded and awaiting approval', 
      data: user 
    });
  } catch (error) {
    next(error);
  }
};



