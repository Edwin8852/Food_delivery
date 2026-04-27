import * as AddressService from '../services/address.service.js';

export const createAddress = async (req, res, next) => {
  try {
    const data = await AddressService.createAddress(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Address added successfully', data });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const data = await AddressService.getAddressesByUserId(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const data = await AddressService.updateAddress(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Address updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const result = await AddressService.deleteAddress(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
