import express from 'express';
import * as CartController from '../controllers/cart.controller.js';
import { protect } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);  // REST-friendly alias
router.post('/add', CartController.addToCart);
router.put('/update', CartController.updateCartItem);
router.delete('/:menuItemId', CartController.removeItem);
router.delete('/', CartController.clearCart);

export default router;
