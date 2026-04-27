import { MenuItem } from '../models/index.js';
import { CustomError } from '../shared/error-handling/customError.js';

export const createMenuItem = async (data) => {
  return await MenuItem.create(data);
};

export const getAllMenuItems = async () => {
  return await MenuItem.findAll();
};

export const getMenuItemsByRestaurant = async (restaurantId) => {
  return await MenuItem.findAll({ where: { restaurantId } });
};

export const getMenuItemById = async (id) => {
  const menuItem = await MenuItem.findByPk(id);
  if (!menuItem) {
    throw new CustomError('Menu item not found', 404);
  }
  return menuItem;
};

export const updateMenuItem = async (id, data) => {
  const menuItem = await MenuItem.findByPk(id);
  if (!menuItem) {
    throw new CustomError('Menu item not found', 404);
  }
  return await menuItem.update(data);
};

export const deleteMenuItem = async (id) => {
  const menuItem = await MenuItem.findByPk(id);
  if (!menuItem) {
    throw new CustomError('Menu item not found', 404);
  }
  await menuItem.destroy();
};
