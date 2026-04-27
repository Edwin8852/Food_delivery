import express from 'express';
import userRoutes from './user.routes.js';
import restaurantRoutes from './restaurant.routes.js';
import menuItemRoutes from './menuItem.routes.js';
import foodRoutes from './food.routes.js'; // ✅ Added
import orderRoutes from './order.routes.js';
import cartRoutes from './cart.routes.js';
import addressRoutes from './address.routes.js';
import deliveryRoutes from './delivery.routes.js';
import adminRoutes from './admin.routes.js';
import couponRoutes from './coupon.routes.js';
import * as AdminController from '../controllers/admin.controller.js';
import * as SettingsController from '../controllers/settings.controller.js';

import { getHomePage } from '../controllers/home.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getHomePage);
router.use('/auth', userRoutes); 
router.use('/restaurants', restaurantRoutes);
router.use('/menu-items', menuItemRoutes);
router.use('/food', foodRoutes); // ✅ Added to fix 404
router.use('/orders', orderRoutes);
router.patch('/order/status', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), AdminController.updateOrderStatus); 
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/admin', adminRoutes);

// ⚙️ Global Operational Parameters (Direct Mount)
router.get('/admin/settings', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), SettingsController.getSettings);
router.put('/admin/settings', protect, authorize('ADMIN', 'RESTAURANT_OWNER'), SettingsController.updateSettings);

router.use('/user', userRoutes);
router.use('/users', userRoutes);
router.use('/coupons', couponRoutes);

export default router;

