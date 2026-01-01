// ============================================
// 2. Routes/AdminRoute.jsx - IMPROVED
// ============================================
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Loading from '../components/Shared/Loading/Loading';

const AdminRoute = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading, isAdmin } = useRole(currentUser?.email);
  const location = useLocation();

  // ✅ Loading state
  if (authLoading || roleLoading) {
    return <Loading />;
  }

  // ✅ Not authenticated - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Not admin - show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have admin privileges to access this area.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;