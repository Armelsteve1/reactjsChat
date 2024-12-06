import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
