import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Address = sequelize.define('Address', {
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
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contact_name',
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contact_number',
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'street',
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: 'Default City',
    field: 'city',
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: 'Default State',
    field: 'state',
  },
  pincode: {
    type: DataTypes.STRING,
    defaultValue: '000000',
    field: 'pincode',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_default',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted',
  }
}, {
  timestamps: true,
  underscored: false,
  tableName: 'addresses',
});

export default Address;
