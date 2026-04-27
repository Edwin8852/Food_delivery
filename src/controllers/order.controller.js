import * as OrderService from '../services/order.service.js';
import { emitOrderStatusUpdate } from '../socket.js';

export const placeOrder = async (req, res, next) => {
  try {
    const data = await OrderService.placeOrder(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Order placed successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const data = await OrderService.getUserOrders(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const data = await OrderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const data = await OrderService.updateStatus(req.params.id, req.body.status);
    
    // Emit real-time status update
    emitOrderStatusUpdate(req.params.id, req.body.status);
    
    res.status(200).json({ success: true, message: 'Order status updated', data });
  } catch (error) {
    next(error);
  }
};

export const payOrder = async (req, res, next) => {
  try {
    const data = await OrderService.processPayment(req.params.id);
    res.status(200).json({ success: true, message: 'Payment successful', data });
  } catch (error) {
    next(error);
  }
};

export const addRating = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const data = await OrderService.addRating(req.params.id, rating, review);
    res.status(200).json({ success: true, message: 'Rating added', data });
  } catch (error) {
    next(error);
  }
};
