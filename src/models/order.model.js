import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'restaurant_id',
  },
  addressId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'address_id',
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'delivery_fee',
  },
  platformFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'platform_fee',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price',
  },
  paymentMethod: {
    type: DataTypes.ENUM('UPI', 'CARD', 'COD'),
    allowNull: false,
    field: 'payment_method',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: 'pending',
    field: 'payment_status',
  },
  orderStatus: {
    type: DataTypes.ENUM('PENDING', 'PLACED', 'ACCEPTED', 'IN_KITCHEN', 'PREPARING', 'READY', 'ASSIGNED', 'RIDER_CONFIRMED', 'OUT_FOR_DELIVERY', 'PICKED_UP', 'DELIVERED', 'CANCELLED', 'REJECTED'),
    defaultValue: 'PENDING',
    field: 'order_status',
  },

  deliveryPartnerId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'delivery_partner_id',
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  proofImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'proof_image_url'
  },
  couponId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'coupon_id'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'discount_amount'
  }

}, {
  timestamps: true,
  underscored: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'orders',
});

export default Order;
