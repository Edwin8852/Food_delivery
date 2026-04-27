import { Address, Order } from '../models/index.js';
import { CustomError } from '../shared/error-handling/customError.js';

export const createAddress = async (userId, data) => {
  // If set to default, unset others first
  if (data.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId, isDeleted: false } });
  }

  return await Address.create({ ...data, userId });
};

export const getAddressesByUserId = async (userId) => {
  return await Address.findAll({ 
    where: { userId, isDeleted: false },
    order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
  });
};

export const updateAddress = async (id, data) => {
  const address = await Address.findOne({ where: { id, isDeleted: false } });
  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  if (data.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId: address.userId, isDeleted: false } });
  }

  return await address.update(data);
};

export const deleteAddress = async (id) => {
  const address = await Address.findByPk(id);
  if (!address) {
    throw new CustomError('Address not found', 404);
  }
  
  // Check if address is linked to any orders
  const orderCount = await Order.count({ where: { addressId: id } });
  
  if (orderCount > 0) {
    // Soft delete if used in orders
    await address.update({ isDeleted: true, isDefault: false });
    return { message: 'Address marked as deleted (archived for order history)' };
  } else {
    // Hard delete if not used
    await address.destroy();
    return { message: 'Address deleted successfully' };
  }
};
