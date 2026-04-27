import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Delivery from './pages/Delivery';
import OrderHistory from './pages/OrderHistory';

export default function RestaurantApp() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800 w-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/history" element={<OrderHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
