import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  can_accept: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  can_pickup: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  can_deliver: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  max_active_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  theme: {
    type: DataTypes.STRING(10),
    defaultValue: 'light'
  }
}, {
  tableName: 'settings',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false
});

export default Settings;
