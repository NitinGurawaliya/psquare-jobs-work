import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute({ children }) {
  const { loading, isAuthed, isAdmin } = useAuth();

  if (loading) return <div className="p-6 text-slate-300">Loading...</div>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div className="p-6 text-rose-300">Not authorized.</div>;
  return children;
}
