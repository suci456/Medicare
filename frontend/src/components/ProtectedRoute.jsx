import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

/**
 * ProtectedRoute ensures the user is authenticated and possesses the required role.
 */
function ProtectedRoute({ role, children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // If user is logged in but doesn't have the required role,
    // redirect them to their own respective dashboard
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/patient/dashboard" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
