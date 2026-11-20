// ============================================
// 1. Routes/PrivateRoute.jsx - IMPROVED
// ============================================
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../components/Shared/Loading/Loading';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!currentUser) {
    // ✅ Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;