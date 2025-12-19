import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { loading, isAuthed } = useAuth();

  if (loading) return <div className="p-6 text-slate-300">Loading...</div>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
