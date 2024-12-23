// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  const storedAuth = localStorage.getItem('isAuthenticated');
  const isAuth = isAuthenticated || JSON.parse(storedAuth);
  const storedRole = localStorage.getItem('userRole');

  return isAuth && allowedRoles.includes(storedRole || userRole) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
