import * as MenuItemService from '../services/menuItem.service.js';

export const createMenuItem = async (req, res, next) => {
  try {
    const data = await MenuItemService.createMenuItem(req.body);
    res.status(201).json({ success: true, message: 'Menu item created successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getAllMenuItems = async (req, res, next) => {
  try {
    const data = await MenuItemService.getAllMenuItems();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemsByRestaurant = async (req, res, next) => {
  try {
    const data = await MenuItemService.getMenuItemsByRestaurant(req.params.restaurantId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const data = await MenuItemService.getMenuItemById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const data = await MenuItemService.updateMenuItem(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Menu item updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    await MenuItemService.deleteMenuItem(req.params.id);
    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
