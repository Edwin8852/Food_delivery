import express from 'express';
import * as AdminController from '../controllers/admin.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

// 🛡️ Security Perimeter: Ensure session integrity for all Admin nodes
router.use(protect);

// 📊 Tactical Analytics & Overviews
router.get('/analytics', authorize('ADMIN', 'RESTAURANT_OWNER'), AdminController.getAnalytics);
router.get('/orders', authorize('ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER'), AdminController.getAllOrders);
router.get('/drivers', authorize('ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER'), AdminController.getDrivers);

// 🛠️ Operational Handlers
router.patch('/order/status', authorize('ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER'), AdminController.updateOrderStatus);
router.post('/order/unassign', authorize('ADMIN', 'RESTAURANT_OWNER'), AdminController.unassignOrder);
router.post('/order/remove-last-assignment', authorize('ADMIN', 'RESTAURANT_OWNER'), AdminController.removeLastAssignment);

export default router;
