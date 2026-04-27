import { MenuItem } from './index.js';

export const createFood = async (data) => {
  return await MenuItem.create(data);
};

export const findAllFoods = async () => {
  return await MenuItem.findAll();
};

export const findFoodsByRestaurantId = async (restaurantId) => {
  return await MenuItem.findAll({ where: { restaurantId } });
};

export const findFoodById = async (id) => {
  return await MenuItem.findByPk(id);
};

export const updateFood = async (id, data) => {
  const food = await MenuItem.findByPk(id);
  if (!food) return null;
  return await food.update(data);
};

export const deleteFood = async (id) => {
  const food = await MenuItem.findByPk(id);
  if (!food) return false;
  await food.destroy();
  return true;
};
