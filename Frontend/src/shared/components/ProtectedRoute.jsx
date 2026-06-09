import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Reusable Route Guard for Authentication and Role Gating.
 * Can be used as a wrapper component or as a layout route in react-router.
 * 
 * Props:
 * - allowedRoles: Array of roles permitted (e.g. ['admin', 'vendor'])
 * - children: Optional child components if not using as a layout Outlet
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // If auth is still loading, return a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium animate-pulse">Loading credentials...</p>
        </div>
      </div>
    );
  }

  // Gate 1: Check if authenticated
  if (!isAuthenticated) {
    // Redirect to login page and preserve original path in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Gate 2: Check if role is authorized
  const userRole = user?.role || 'user';
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // If user role is not authorized, redirect to home page
    console.warn(`Access denied for role '${userRole}'. Permitted roles:`, allowedRoles);
    return <Navigate to="/" replace />;
  }

  // Render children or nested react-router-dom Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
