// backend/seedCoupons.js
import { Coupon } from './src/models/index.js';
import sequelize from './src/config/db.js';

const seedCoupons = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const coupons = [
      {
        code: 'SAVE50',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        minOrderAmount: 100,
        maxDiscount: 200,
        expiryDate: new Date('2026-12-31'),
        startDate: new Date('2024-01-01'),
        isActive: true
      },
      {
        code: 'WELCOME100',
        discountType: 'FIXED',
        discountValue: 100,
        minOrderAmount: 500,
        maxDiscount: 0,
        expiryDate: new Date('2026-12-31'),
        startDate: new Date('2024-01-01'),
        isActive: true
      },
      {
        code: 'FREEFLY',
        discountType: 'PERCENTAGE',
        discountValue: 100,
        minOrderAmount: 0,
        maxDiscount: 50,
        expiryDate: new Date('2026-12-31'),
        startDate: new Date('2024-01-01'),
        isActive: true
      }
    ];

    for (const couponData of coupons) {
        // Use destroy + create to ensure fields are correctly updated
        await Coupon.destroy({ where: { code: couponData.code } });
        await Coupon.create(couponData);
        console.log(`✅ Provisioned coupon: ${couponData.code}`);
    }

    console.log('🚀 Coupon provision sync complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedCoupons();
