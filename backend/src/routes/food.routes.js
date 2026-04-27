import express from 'express';
import * as FoodController from '../controllers/food.controller.js';
import { protect, authorize } from '../shared/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', FoodController.getFoods);
router.get('/restaurant/:restaurantId', FoodController.getFoodsByRestaurant);
router.post('/', protect, authorize('ADMIN', 'admin', 'RESTAURANT_OWNER', 'restaurant_owner'), FoodController.createFood);
router.put('/:id', protect, authorize('ADMIN', 'admin', 'RESTAURANT_OWNER', 'restaurant_owner'), FoodController.updateFood);
router.delete('/:id', protect, authorize('ADMIN', 'admin', 'RESTAURANT_OWNER', 'restaurant_owner'), FoodController.deleteFood);

export default router;
