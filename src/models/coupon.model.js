import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(val) {
      this.setDataValue('code', val.toUpperCase());
    }
  },
  discountType: {
    type: DataTypes.ENUM('PERCENTAGE', 'FIXED'),
    defaultValue: 'PERCENTAGE'
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  minOrderAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  maxDiscount: {
    type: DataTypes.FLOAT,
    defaultValue: 0 // For percentage discounts
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'coupons'
});

export default Coupon;
