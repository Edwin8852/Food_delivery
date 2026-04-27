import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'image_url', // maps DB column image_url to imageUrl attribute
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0,
  },
  deliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'delivery_time',
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'owner_id',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  }
}, {
  timestamps: true,
  underscored: false, // Use camelCase columns to match schema
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'restaurants',
});

export default Restaurant;
