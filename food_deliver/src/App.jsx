import { useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FloatingCart from "./components/FloatingCart";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";
import OrderTracking from "./pages/OrderTracking";
import UserProfile from "./pages/UserProfile";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryLayout from "./layouts/delivery/DeliveryLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminMenu from "./pages/Admin/AdminMenu";
import AdminOrders from "./pages/Admin/AdminOrders";
import KitchenMonitor from "./pages/Admin/KitchenMonitor";
import DeliveryManagement from "./pages/Admin/DeliveryManagement";
import LiveFeed from "./pages/Admin/LiveFeed";
import ActiveOrders from "./pages/delivery/ActiveOrders";
import OrderHistory from "./pages/delivery/OrderHistory";
import Earnings from "./pages/delivery/Earnings";
import Profile from "./pages/delivery/Profile";
import RestaurantApp from "./restaurant/RestaurantApp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import DeliveryTracking from "./pages/delivery/DeliveryTracking";
import { ThemeProvider } from "./context/ThemeContext";
import AdminSettings from "./pages/Admin/AdminSettings";
import Promotions from "./pages/Admin/Promotions";

function App() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const location = useLocation();

  const isRestaurantRoute = location.pathname.startsWith('/restaurant');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDeliveryRoute = location.pathname.startsWith('/delivery');
  
  // Role-based logic
  const savedUser = JSON.parse(sessionStorage.getItem('user'));
  const isDeliveryUser = savedUser?.role === "DELIVERY" || savedUser?.role === "DELIVERY_PARTNER";
  
  const hideStandardNav = isRestaurantRoute || isAdminRoute || isDeliveryRoute;

  const isDedicatedRoleRoute = isRestaurantRoute || isAdminRoute || isDeliveryRoute;

  return (
    <ThemeProvider>
    <div className="min-h-screen flex flex-col font-sans bg-swiggy-bg dark:bg-slate-900 text-swiggy-heading dark:text-slate-200 transition-colors duration-500">
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />
      {!hideStandardNav && <Navbar />}
      {!isDedicatedRoleRoute && <FloatingCart />}
      <main className={`flex-1 ${!isDedicatedRoleRoute ? 'pt-24 px-5 pb-10 max-w-7xl w-full mx-auto' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={
            <ProtectedRoute role="USER">
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart setCurrentOrder={setCurrentOrder} />} />
          <Route path="/order-tracking" element={<OrderTracking order={currentOrder} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={
            <ProtectedRoute role="USER">
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          
          {/* Delivery Routes Wrapped in DeliveryLayout */}
          <Route path="/delivery" element={
            <ProtectedRoute role={["DELIVERY", "DELIVERY_PARTNER"]}>
              <DeliveryLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/delivery/dashboard" replace />} />
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="orders" element={<ActiveOrders />} />
            <Route path="history" element={<OrderHistory />} />
            <Route path="tracking" element={<DeliveryTracking />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role={["ADMIN", "restaurant_owner", "RESTAURANT_OWNER"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="kitchen" element={<KitchenMonitor />} />
            <Route path="drivers" element={<DeliveryManagement />} />
            <Route path="live-feed" element={<LiveFeed />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>



          {/* NEW Restaurant Admin Module */}
          <Route path="/restaurant/*" element={
            <ProtectedRoute role="ADMIN">
              <RestaurantApp />
            </ProtectedRoute>
          } />

          {/* Legacy Delivery Redirects */}
          <Route path="/delivery-dashboard" element={<Navigate to="/delivery/dashboard" replace />} />
          <Route path="/delivery-orders" element={<Navigate to="/delivery/orders" replace />} />
          <Route path="/delivery-history" element={<Navigate to="/delivery/history" replace />} />
          <Route path="/delivery-profile" element={<Navigate to="/delivery/profile" replace />} />
          <Route path="/delivery-tracking" element={<Navigate to="/delivery/tracking" replace />} />
          <Route path="/delivery-earnings" element={<Navigate to="/delivery/earnings" replace />} />

          {/* Legacy Admin Redirects */}
          <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin-orders" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin-menu" element={<Navigate to="/admin/menu" replace />} />

        </Routes>
      </main>
      {!isDedicatedRoleRoute && <Footer />}
    </div>
    </ThemeProvider>
  );
}

export default App;
