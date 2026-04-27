import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'order_id',
  },
  foodId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'food_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  name: {
     type: DataTypes.STRING(150),
     allowNull: true,
  },
  code: {
     type: DataTypes.STRING(20),
     allowNull: true,
  },
  priceAtTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_at_time',
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'order_items',
});

export default OrderItem;
