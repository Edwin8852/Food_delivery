import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define('Cart', {
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
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'food_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'cart',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'food_id'],
    }
  ],
});

export default Cart;