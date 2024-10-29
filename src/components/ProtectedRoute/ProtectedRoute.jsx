import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const user = useSelector(state => state.profile.userDetails);

    if (!user) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/no-access" />;

    return children;
};

export default ProtectedRoute;
