import express from 'express';
import * as RestaurantController from '../controllers/restaurant.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', RestaurantController.getRestaurants);

// ✅ Specific routes FIRST
router.get('/orders/history', RestaurantController.getAdminOrderHistory);
router.get('/orders', RestaurantController.getAdminOrders);

// ✅ Dynamic routes AFTER
router.get('/:id', RestaurantController.getRestaurantById);
router.post('/', protect, authorize('admin', 'restaurant_owner'), RestaurantController.createRestaurant);
router.put('/:id', protect, authorize('admin', 'restaurant_owner'), RestaurantController.updateRestaurant);
router.delete('/:id', protect, authorize('admin'), RestaurantController.deleteRestaurant);

// Admin / Restaurant Owner Order Management Flow
router.patch('/orders/:id/accept', RestaurantController.acceptOrder);
router.patch('/orders/:id/kitchen', RestaurantController.sendToKitchen);
router.patch('/orders/:id/ready', RestaurantController.markOrderReady);
router.post('/orders/:id/assign-delivery', RestaurantController.assignDelivery);

export default router;
