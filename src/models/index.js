import User from './user.model.js';
import Restaurant from './restaurant.model.js';
import MenuItem from './menuItem.model.js';
import Address from './address.model.js';
import Order from './order.model.js';
import OrderItem from './orderItem.model.js';
import Cart from './cart.model.js';
import DeliveryPartner from './deliveryPartner.model.js';
import Coupon from './coupon.model.js';

// User Associations
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Restaurant, { foreignKey: 'ownerId', as: 'restaurants' });
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Order, { foreignKey: 'userId', as: 'customerOrders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

User.hasMany(Order, { foreignKey: 'deliveryPartnerId', as: 'deliveries' });
Order.belongsTo(User, { foreignKey: 'deliveryPartnerId', as: 'deliveryPartner' });

User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Restaurant Associations
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', as: 'menuItems' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Order Associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

MenuItem.hasMany(OrderItem, { foreignKey: 'foodId' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'foodId', as: 'menuItem' });

Order.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });
Address.hasMany(Order, { foreignKey: 'addressId', as: 'orders' });

// Cart & MenuItem
MenuItem.hasMany(Cart, { foreignKey: 'menuItemId' });
Cart.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

import Settings from './settings.model.js';

export {
  User,
  Restaurant,
  MenuItem,
  Address,
  Order,
  OrderItem,
  Cart,
  DeliveryPartner,
  Coupon,
  Settings
};

