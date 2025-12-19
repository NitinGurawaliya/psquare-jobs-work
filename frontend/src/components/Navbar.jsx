import { Link } from 'react-router-dom';
import { Container } from './Container';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAuthed, user, logout } = useAuth();

  return (
    <div className="border-b border-slate-900 bg-slate-950/60 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="font-bold tracking-tight">
            Job Bank
          </Link>

          <div className="flex items-center gap-3">
            <Link className="text-sm text-slate-200 hover:text-white" to="/companies">
              Companies
            </Link>

            {!isAuthed ? (
              <>
                <Link className="text-sm text-slate-200 hover:text-white" to="/signup">
                  Sign up
                </Link>
                <Link className="text-sm text-slate-200 hover:text-white" to="/login">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link className="text-sm text-slate-200 hover:text-white" to="/dashboard">
                  Dashboard
                </Link>
                <Link className="text-sm text-slate-200 hover:text-white" to="/admin/companies">
                  Manage
                </Link>
                <div className="hidden text-sm text-slate-400 sm:block">{user?.email}</div>
                <button
                  onClick={logout}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
