import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
    children: ReactNode;
    role:string |null
}

const AdminRoute:React.FC<AdminRouteProps> = ({ children, role }) => {
    if (role !== 'admin') {
        return <Navigate to="/home" />;
    }

    return <>{children}</>;
};

export default AdminRoute