import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0
  });
  const [revenue, setRevenue] = useState(0);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/restaurants/orders/history', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search,
          dateFilter
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.totalPages,
          totalCount: response.data.data.totalCount
        }));
        setRevenue(response.data.data.totalRevenue);
      }
    } catch (err) {
      console.error("History fetch error:", err);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, dateFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchHistory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Order History</h2>
          <p className="text-gray-500 font-medium">Review past performance and analytics</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 min-w-[280px]">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Revenue</p>
             <p className="text-2xl font-black text-gray-900 leading-none">₹{revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search Order ID or Customer Name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="w-full bg-white border border-gray-200 rounded-2xl px-12 py-4 text-sm font-bold placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select 
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
          className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm cursor-pointer appearance-none"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest text-sm">
                    No results matching your filters
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-gray-900 mb-1">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Intl.DateTimeFormat('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: true 
                        }).format(new Date(order.createdAt))}
                      </p>
                    </td>
                    <td className="px-6 py-5 max-w-[200px]">
                      <div className="space-y-0.5">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-orange-500 px-1 bg-orange-50 rounded">x{item.quantity}</span>
                            <span className="text-xs font-bold text-gray-700 truncate">{item.name || item.code}</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-[10px] font-bold text-gray-400 italic">+{order.items.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-gray-800 leading-none mb-1 uppercase tracking-tight">{order.User?.name || 'Guest'}</p>
                      <p className="text-[10px] font-bold text-gray-400">{order.User?.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-black text-gray-800 leading-none mb-1 flex items-center gap-1.5">
                        {order.paymentMethod}
                        <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      </p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {order.paymentStatus}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.orderStatus === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {order.orderStatus}
                      </span>
                      {order.deliveryPartner && (
                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase truncate max-w-[100px] mx-auto">By {order.deliveryPartner.name}</p>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-sm font-black text-gray-900 tracking-tight">₹{order.totalAmount}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="px-6 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing <span className="text-gray-900">{orders.length}</span> of {pagination.totalCount} results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex items-center gap-1.5">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                      pagination.page === i + 1 
                        ? 'bg-orange-600 text-white shadow-lg' 
                        : 'bg-white border border-gray-200 text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
