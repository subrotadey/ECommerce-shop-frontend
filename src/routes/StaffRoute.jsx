// Routes/StaffRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Shared/Loading/Loading';

const StaffRoute = ({ children }) => {
    const { currentUser, loading: authLoading } = useAuth();
    const { role, isLoading: roleLoading } = useRole(currentUser?.email);
    const location = useLocation();

    if (authLoading || roleLoading) {
        return <Loading />;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin অথবা Staff - দুজনেই access পাবে
    if (role !== 'admin' && role !== 'staff') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You don't have staff privileges</p>
                    <Navigate to="/" replace />
                </div>
            </div>
        );
    }

    return children;
};

export default StaffRoute;