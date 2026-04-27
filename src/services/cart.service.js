import { Cart, MenuItem, User } from '../models/index.js';
import { CustomError } from '../shared/error-handling/customError.js';

export const addToCart = async (userId, menuItemId, quantity) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new CustomError('User does not exist', 401);
  }

  // 🛡️ Guard against invalid UUID syntax (e.g. 'st-1')
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(menuItemId)) {
    throw new CustomError('Valid Menu Item ID required (UUID)', 400);
  }

  const menuItem = await MenuItem.findByPk(menuItemId);
  if (!menuItem) {
    throw new CustomError('Menu item does not exist', 404);
  }

  const [item, created] = await Cart.findOrCreate({
    where: { userId, menuItemId },
    defaults: { quantity }
  });

  if (!created) {
    item.quantity += quantity;
    await item.save();
  }

  return item;
};

export const getCartDetails = async (userId) => {
  return await Cart.findAll({
    where: { userId },
    include: [
      {
        model: MenuItem,
        as: 'menuItem'
      }
    ]
  });
};

export const updateCartItem = async (userId, menuItemId, quantity) => {
  const item = await Cart.findOne({ where: { userId, menuItemId } });
  if (item) {
    item.quantity = quantity;
    await item.save();
  }
  return item;
};

export const removeItem = async (userId, menuItemId) => {
  await Cart.destroy({ where: { userId, menuItemId } });
};

export const clearCart = async (userId) => {
  await Cart.destroy({ where: { userId } });
};
