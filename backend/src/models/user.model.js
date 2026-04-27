import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('USER', 'ADMIN', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER'),
    defaultValue: 'USER',
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wallet: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  aadhaarNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  licenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  vehicleNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  vehicleType: {
    type: DataTypes.ENUM('BIKE', 'CYCLE', 'SCOOTER'),
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastActiveAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isBusy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  currentOrderId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  completedOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  cancelledOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
  },
  todayEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  shiftStart: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  shiftEnd: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  fcmToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  aadhaarImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  licenseImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  panNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  panImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  verificationStatus: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
  }




}, {
  timestamps: true,
  underscored: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'users',
});

export default User;
