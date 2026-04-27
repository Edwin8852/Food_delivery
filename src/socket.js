import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, replace with your frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Join a specific order room for real-time status updates
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`👤 Client ${socket.id} joined room: order_${orderId}`);
    });

    // Join a restaurant room for incoming order notifications
    socket.on('join_restaurant', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
      console.log(`🏪 Client ${socket.id} joined room: restaurant_${restaurantId}`);
    });
    
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Client ${socket.id} joined private room: user_${userId}`);
    });

    socket.on('join_delivery', () => {
      socket.join('delivery_pool');
      console.log(`🚴 Client ${socket.id} joined delivery pool`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitOrderStatusUpdate = (orderId, status) => {
  if (io) {
    io.to(`order_${orderId}`).emit('order:update', { orderId, status });
    io.emit('order:update', { orderId, status }); // Global for Admin
  }
};

export const emitOrderAssigned = (orderId, deliveryPartnerId, order) => {
  if (io) {
    // Notify the specific rider
    io.to(`user_${deliveryPartnerId}`).emit('order:assigned', order);
    // Notify general updates
    io.emit('order:update', order);
  }
};

export const emitLocationUpdate = (orderId, lat, lng) => {
  if (io) {
    io.to(`order_${orderId}`).emit('location_update', { orderId, lat, lng });
  }
};

export const emitNewOrder = (restaurantId, order) => {
  if (io) {
    io.to(`restaurant_${restaurantId}`).emit('new_order', order);
    io.emit('order:new', order); // Global emit for Admin Dashboard
  }
};

export const emitNewDeliveryOrder = (order) => {
  if (io) {
    io.to('delivery_pool').emit('new_delivery_order', order);
  }
};
