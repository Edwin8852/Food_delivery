import { Coupon } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Grid Failure: Could not retrieve coupons' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Validation Failure: Check coupon parameters' });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found in grid' });

    await coupon.update(req.body);
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Sync Failure: Could not update coupon' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon terminated from grid' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Operational Failure' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startDate: { [Op.lte]: new Date() },
        expiryDate: { [Op.gte]: new Date() }
      }
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or Expired Promo Code' });
    }

    if (amount < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Minimum payload of ₹${coupon.minOrderAmount} required for this code` });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Promo Code usage limit reached' });
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    res.json({ 
      success: true, 
      data: {
        code: coupon.code,
        discount,
        couponId: coupon.id,
        minOrderAmount: coupon.minOrderAmount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Validation System Failure' });
  }
};
