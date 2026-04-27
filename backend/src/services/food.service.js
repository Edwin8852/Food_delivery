import * as FoodModel from '../models/food.model.js';
import { CustomError } from '../shared/error-handling/customError.js';

export const createFood = async (data) => {
  return await FoodModel.createFood(data);
};

export const getAllFoods = async () => {
  return await FoodModel.findAllFoods();
};

export const getFoodsByRestaurant = async (restaurantId) => {
  return await FoodModel.findFoodsByRestaurantId(restaurantId);
};

export const getFoodById = async (id) => {
  const food = await FoodModel.findFoodById(id);
  if (!food) {
    throw new CustomError('Food item not found', 404);
  }
  return food;
};

export const updateFood = async (id, data) => {
  const food = await FoodModel.updateFood(id, data);
  if (!food) {
    throw new CustomError('Food item not found', 404);
  }
  return food;
};

export const deleteFood = async (id) => {
  await FoodModel.deleteFood(id);
};
