import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MapView = ({ order }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Placeholder
  });

  if (!isLoaded) return <div className="h-48 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400 font-bold">Loading Map...</div>;

  const center = { lat: 12.9716, lng: 77.5946 }; 

  return (
    <GoogleMap
      zoom={14}
      center={center}
      mapContainerStyle={{ width: "100%", height: "200px", borderRadius: "12px" }}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, count: 0 });
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [profile, setProfile] = useState(null);
  
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const fetchProfile = async () => {
     try {
       const res = await api.get('/auth/profile');
       if (res.data.success) {
         setProfile(res.data.data);
         setIsOnline(res.data.data.isOnline);
       }
     } catch (err) {
       console.error("Profile fetch error", err);
     }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/delivery/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch delivery orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchEarningsAndHistory = async () => {
    try {
      const [earningsRes, historyRes] = await Promise.all([
        api.get('/delivery/earnings'),
        api.get('/delivery/history')
      ]);
      if (earningsRes.data.success) setEarnings({ total: earningsRes.data.total, count: earningsRes.data.count });
      if (historyRes.data.success) setHistory(historyRes.data.data);
    } catch (error) {
      console.error("Error fetching earnings/history", error);
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "DELIVERY" && user.role !== "DELIVERY_PARTNER") {
      navigate("/");
      return;
    }

    fetchProfile();
    fetchOrders();
    fetchEarningsAndHistory();

    socketRef.current = io(BACKEND_URL);
    socketRef.current.on('connect', () => {
       socketRef.current.emit("join_delivery");
    });

    socketRef.current.on('new_delivery_order', (order) => {
       toast.info("🚨 New Order Alert!", { position: "top-center" });
       fetchOrders();
    });

    socketRef.current.on('status_update', () => fetchOrders());

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    let watchId;
    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        api.post("/delivery/location", { lat: latitude, lng: longitude })
           .catch(err => console.error("Location update failed", err));
      }, (err) => console.warn(err), { enableHighAccuracy: true });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      const res = await api.put("/delivery/status", { isOnline: newStatus });
      if (res.data.success) {
        setIsOnline(newStatus);
        toast.success(`Status: ${newStatus ? 'ONLINE' : 'OFFLINE'}`);
      }
    } catch (error) {
      toast.error("Status toggle failed");
    }
  };

  const uploadProof = async (orderId, file) => {
    setUploadingId(orderId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post(`/delivery/upload-proof/${orderId}`, formData);
      if (res.data.success) {
        toast.success("Proof uploaded successfully! ✅");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, proofImageUrl: res.data.url } : o));
      }
    } catch (err) {
      toast.error("Proof upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const markPaid = async (orderId) => {
    try {
      const res = await api.put(`/delivery/payment/${orderId}`, { status: 'paid' });
      if (res.data.success) {
        toast.success("Payment marked as PAID! 💰");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Payment update failed");
    }
  };

  const acceptOrder = async (id) => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: 'UPDATING...' } : o));
      const response = await api.put(`/delivery/accept/${id}`);
      if (response.data.success) {
        toast.success("Order Accepted! 🎉");
        fetchOrders();
      }
    } catch (error) {
       toast.error("Error accepting order");
       fetchOrders();
    }
  };

  const rejectOrder = async (id) => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: 'UPDATING...' } : o));
      const response = await api.put(`/delivery/reject/${id}`);
      if (response.data.success) {
        toast.info("Order Rejected");
        fetchOrders();
      }
    } catch (error) {
        toast.error("Error");
        fetchOrders();
    }
  };

  const markPickedUp = async (id) => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: 'UPDATING...' } : o));
      const response = await api.put(`/delivery/pickup/${id}`);
      if (response.data.success) {
        toast.success("Picked Up! 🚚");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Update failed");
      fetchOrders();
    }
  };

  const markDelivered = async (id) => {
    try {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: 'UPDATING...' } : o));
      const response = await api.put(`/delivery/deliver/${id}`);
      if (response.data.success) {
        toast.success("Delivered! 📦✅");
        fetchOrders();
        fetchEarningsAndHistory();
        fetchProfile(); // update wallet balance
      }
    } catch (error) {
      toast.error("Update failed");
      fetchOrders();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center flex flex-col items-center gap-4">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <span role="img" aria-label="bicycle">🚴</span> Partner Hub
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 flex items-center gap-2">
                 <span className="text-xl">💰</span>
                 <span className="font-black text-orange-600">₹{parseFloat(profile?.wallet || 0).toFixed(2)}</span>
              </div>
              <button 
                onClick={toggleStatus}
                className={`px-6 py-2 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${
                  isOnline ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
             <div className="text-7xl mb-6 opacity-30">🚚</div>
             <h3 className="text-2xl font-bold text-gray-800">Ready for a mission?</h3>
             <p className="text-gray-500 mt-2">New orders will show up here as soon as they are ready.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {orders.map((order) => {
              const { id, User: customer, address, orderStatus, totalAmount, paymentStatus, paymentMethod, proofImageUrl } = order;
              const isPending = orderStatus === 'READY' || orderStatus === 'Pending' || orderStatus === 'PLACED';
              const isAccepted = orderStatus === 'ACCEPTED';
              const isPickedUp = orderStatus === 'OUT_FOR_DELIVERY' || orderStatus === 'PickedUp';

              return (
                <div key={id} className="relative bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">#{id.substring(0,8)}</h2>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-3xl bg-gray-50 flex items-center justify-center text-3xl">👤</div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Customer</p>
                        <h3 className="text-xl font-black text-gray-800">{customer?.name}</h3>
                      </div>
                    </div>

                    {(isAccepted || isPickedUp) && <MapView order={order} />}

                    <div className="mt-8 space-y-4">
                       <div className="flex gap-4 items-start">
                          <span className="text-2xl opacity-40">📍</span>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Drop Location</p>
                            <p className="font-bold text-gray-700 text-sm">{address?.street}, {address?.city}</p>
                          </div>
                       </div>
                       <div className="flex gap-4 items-start">
                          <span className="text-2xl opacity-40">💳</span>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Payment Method</p>
                            <p className="font-black text-gray-800 uppercase text-sm">{paymentMethod}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-3 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-gray-400 font-bold uppercase text-xs">Collection Amount</span>
                       <span className="text-2xl font-black text-gray-800">₹{parseFloat(totalAmount).toFixed(2)}</span>
                    </div>

                    {isPending && (
                      <div className="flex gap-3">
                         <button onClick={() => acceptOrder(id)} className="flex-1 bg-green-500 h-14 rounded-[20px] text-white font-black hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95">Accept</button>
                         <button onClick={() => rejectOrder(id)} className="flex-1 bg-gray-100 h-14 rounded-[20px] text-gray-500 font-black hover:bg-gray-200 transition-all active:scale-95">Reject</button>
                      </div>
                    )}

                    {isAccepted && (
                      <button onClick={() => markPickedUp(id)} className="w-full bg-[#ff5200] h-14 rounded-[20px] text-white font-black shadow-lg shadow-orange-100 transition-all active:scale-95">🚚 Mark Picked Up</button>
                    )}

                    {isPickedUp && (
                      <div className="space-y-3">
                        {paymentStatus !== 'paid' && paymentMethod === 'COD' && (
                           <button onClick={() => markPaid(id)} className="w-full bg-green-100 text-green-700 h-14 rounded-[20px] font-black border-2 border-green-200">💰 Mark Payment Received</button>
                        )}
                        
                        {!proofImageUrl ? (
                          <div className="relative">
                            <input type="file" accept="image/*" onChange={(e) => uploadProof(id, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <button className={`w-full h-14 rounded-[20px] font-black border-2 border-dashed flex items-center justify-center gap-2 ${uploadingId === id ? 'bg-gray-50 opacity-50' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                               {uploadingId === id ? 'Uploading...' : '📸 Upload Delivery Proof'}
                            </button>
                          </div>
                        ) : (
                          <div className="h-14 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center font-bold gap-2">
                             ✅ Proof Uploaded
                          </div>
                        )}

                        <button onClick={() => markDelivered(id)} className="w-full bg-blue-600 h-14 rounded-[20px] text-white font-black shadow-lg shadow-blue-100 transition-all active:scale-95">📦 Confirm Delivery</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pb-20">
           <div className="bg-white rounded-[40px] p-10 shadow-lg border border-gray-100 flex flex-col justify-between">
              <h3 className="text-xl font-black text-gray-800 mb-8">Performance Summary</h3>
              <div className="flex items-end justify-between">
                 <div>
                    <span className="text-5xl font-black text-orange-500">{earnings.count}</span>
                    <p className="font-bold text-gray-400 uppercase text-xs tracking-widest mt-2">Orders Today</p>
                 </div>
                 <div className="text-right">
                    <span className="text-4xl font-black text-gray-800">₹{parseFloat(earnings.total).toFixed(2)}</span>
                    <p className="font-bold text-gray-400 uppercase text-xs tracking-widest mt-2">Fleet Bonus Earned</p>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[40px] p-10 shadow-lg border border-gray-100">
              <h3 className="text-xl font-black text-gray-800 mb-8">History</h3>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                 {history.map(o => (
                   <div key={o.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="font-bold text-gray-500">#{o.id.substring(0,8)}</span>
                      <span className="font-black text-green-600">+ ₹50.00</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
