import * as FoodService from '../services/food.service.js';

export const createFood = async (req, res, next) => {
  try {
    const data = await FoodService.createFood(req.body);
    res.status(201).json({ success: true, message: 'Food item created successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getFoods = async (req, res, next) => {
  try {
    const data = await FoodService.getAllFoods();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getFoodsByRestaurant = async (req, res, next) => {
  try {
    const data = await FoodService.getFoodsByRestaurant(req.params.restaurantId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const data = await FoodService.updateFood(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Food item updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    await FoodService.deleteFood(req.params.id);
    res.status(200).json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
