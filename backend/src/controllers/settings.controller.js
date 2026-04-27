import { Settings } from '../models/index.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    // Seed if not exists
    if (!settings) {
      settings = await Settings.create({
        can_accept: true,
        can_pickup: true,
        can_deliver: true,
        max_active_orders: 3,
        theme: 'light'
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { can_accept, can_pickup, can_deliver, max_active_orders, theme } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        can_accept, can_pickup, can_deliver, max_active_orders, theme
      });
    } else {
      await settings.update({
        can_accept, can_pickup, can_deliver, max_active_orders, theme
      });
    }

    res.status(200).json({
      success: true,
      message: 'Global parameters updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};
