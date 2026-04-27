import * as RestaurantService from '../services/restaurant.service.js';

export const createRestaurant = async (req, res, next) => {
  try {
    const data = await RestaurantService.createRestaurant({ ...req.body, ownerId: req.user.id });
    res.status(201).json({ success: true, message: 'Restaurant created successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getRestaurants = async (req, res, next) => {
  try {
    const data = await RestaurantService.getAllRestaurants(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const data = await RestaurantService.getRestaurantById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const data = await RestaurantService.updateRestaurant(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Restaurant updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    await RestaurantService.deleteRestaurant(req.params.id);
    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ----- RESTAURANT ADMIN ACTIONS ----- //
import * as OrderService from '../services/order.service.js';

export const getAdminOrders = async (req, res, next) => {
  try {
    const data = await OrderService.getAllRestaurantOrders();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const data = await OrderService.acceptOrder(req.params.id);
    res.status(200).json({ success: true, message: 'Order ACCEPTED', data });
  } catch (error) {
    next(error);
  }
};

export const sendToKitchen = async (req, res, next) => {
  try {
    const data = await OrderService.sendToKitchen(req.params.id);
    res.status(200).json({ success: true, message: 'Order sent IN_KITCHEN', data });
  } catch (error) {
    next(error);
  }
};

export const markOrderReady = async (req, res, next) => {
  try {
    const data = await OrderService.markOrderReady(req.params.id);
    res.status(200).json({ success: true, message: 'Order marked READY', data });
  } catch (error) {
    next(error);
  }
};

export const assignDelivery = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;
    if (!deliveryPartnerId) {
      return res.status(400).json({ success: false, message: 'Delivery Partner ID is required' });
    }
    const data = await OrderService.assignDelivery(req.params.id, deliveryPartnerId);
    res.status(200).json({ success: true, message: 'Delivery assigned', data });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderHistory = async (req, res, next) => {
  try {
    const data = await OrderService.getOrderHistory(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
