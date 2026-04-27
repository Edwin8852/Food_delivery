import * as CartService from '../services/cart.service.js';

export const addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ success: false, message: 'menuItemId is required' });
    }

    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      return res.status(400).json({ success: false, message: 'quantity must be a positive number' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cart = await CartService.addToCart(req.user.id, menuItemId, Number(quantity));
    res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
  } catch (error) {
    console.error('[CART CONTROLLER ERROR] Add to cart:', error);
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const data = await CartService.getCartDetails(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    const data = await CartService.updateCartItem(req.user.id, menuItemId, quantity);
    res.status(200).json({ success: true, message: 'Cart updated', data });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    await CartService.removeItem(req.user.id, menuItemId);
    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    await CartService.clearCart(req.user.id);
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
