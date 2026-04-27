import axios from 'axios';

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log(`🚀 [API Service] Backend URL: ${BACKEND_URL}`);

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add the auth token and log
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const role = user?.role?.toUpperCase();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 SECURITY PROTOCOL: Prevent Role-API mismatch
    const adminPaths = ['/admin', '/analytics', '/inventory'];
    const isAdminPath = adminPaths.some(path => config.url?.startsWith(path));
    
    if (isAdminPath && role !== 'ADMIN' && role !== 'RESTAURANT_OWNER') {
       console.error(`🛑 [SECURITY BLOCK] ${role} attempted to access ${config.url}`);
       return Promise.reject({
         response: { status: 403, data: { message: "Role Authorization Failure" } }
       });
    }
    
    // Log request
    console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      token: token ? 'Present ✓' : 'No token'
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to log results and handle global errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.message;

    console.group(`🛑 [API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error('Status:', status);
    console.error('Message:', message);
    if (error.response?.data) console.error('Server Data:', error.response.data);
    console.groupEnd();

    // Specific error handling
    if (status === 401) {
      console.warn('⚠️ Unauthorized - Redirecting to Login...');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    } else if (status === 500) {
      console.error('🔥 Server Crash detected');
    }

    return Promise.reject({
      ...error,
      userMessage: message // Attach a cleaner message for the UI
    });
  }
);

export default api;
