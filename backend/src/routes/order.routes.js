import express from 'express';
import * as OrderController from '../controllers/order.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', OrderController.placeOrder);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.patch('/:id/status', authorize('admin', 'restaurant_owner', 'delivery_partner'), OrderController.updateStatus);
router.patch('/:id/pay', OrderController.payOrder);
router.post('/:id/rating', OrderController.addRating);

export default router;
