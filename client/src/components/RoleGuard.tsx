import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

interface RoleGuardProps {
    allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && user.role !== UserRole.SUPER_ADMIN && user.hasActiveSubscription === false) {
        return <Navigate to="/pricing" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard instead of unauthorized
        if (user?.role === UserRole.SUPER_ADMIN) return <Navigate to="/admin/dashboard" replace />;
        if (user?.role === UserRole.SCHOOL_ADMIN) return <Navigate to="/school/dashboard" replace />;
        if (user?.role === UserRole.TEACHER) return <Navigate to="/teacher/dashboard" replace />;

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
