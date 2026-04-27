import { Restaurant, MenuItem, User } from '../models/index.js';
import { CustomError } from '../shared/error-handling/customError.js';

export const createRestaurant = async (data) => {
  return await Restaurant.create(data);
};

export const getAllRestaurants = async (filters = {}) => {
  return await Restaurant.findAll({
    where: filters,
    include: [{ model: MenuItem, as: 'menuItems' }]
  });
};

export const getRestaurantById = async (id) => {
  const restaurant = await Restaurant.findByPk(id, {
    include: [{ model: MenuItem, as: 'menuItems' }, { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
  });
  if (!restaurant) {
    throw new CustomError('Restaurant not found', 404);
  }
  return restaurant;
};

export const updateRestaurant = async (id, data) => {
  const restaurant = await Restaurant.findByPk(id);
  if (!restaurant) {
    throw new CustomError('Restaurant not found', 404);
  }
  return await restaurant.update(data);
};

export const deleteRestaurant = async (id) => {
  const restaurant = await Restaurant.findByPk(id);
  if (!restaurant) {
    throw new CustomError('Restaurant not found', 404);
  }
  await restaurant.destroy();
};
