
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
