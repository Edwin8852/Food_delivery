import express from 'express';
import { 
  getAllCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  validateCoupon 
} from '../controllers/coupon.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/validate', protect, validateCoupon);

// Admin only routes
router.use(protect, authorize('ADMIN'));
router.get('/', getAllCoupons);
router.post('/', createCoupon);
router.patch('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;
