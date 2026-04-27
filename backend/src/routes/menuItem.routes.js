import express from 'express';
import * as MenuItemController from '../controllers/menuItem.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', MenuItemController.getAllMenuItems);
router.get('/restaurant/:restaurantId', MenuItemController.getMenuItemsByRestaurant);
router.get('/:id', MenuItemController.getMenuItemById);

// Protected routes (Admin or Restaurant Owner only)
router.post('/', protect, authorize('admin', 'restaurant_owner'), MenuItemController.createMenuItem);
router.put('/:id', protect, authorize('admin', 'restaurant_owner'), MenuItemController.updateMenuItem);
router.delete('/:id', protect, authorize('admin', 'restaurant_owner'), MenuItemController.deleteMenuItem);

export default router;
