import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute } from '../utils/roleRedirect';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center p-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5200]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && !([].concat(role).map(r => r.toUpperCase()).includes(user.role?.toUpperCase()))) {
    console.warn(`🚫 [Security Hub] Access Denied for role: ${user.role}. Redirecting to tactical dashboard.`);
    return <Navigate to={getDashboardRoute()} replace />;
  }

  return children;
}
