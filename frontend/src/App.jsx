import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AdminCompanies } from './pages/AdminCompanies';
import { Companies } from './pages/Companies';
import { CompanyJobs } from './pages/CompanyJobs';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SetPassword } from './pages/SetPassword';
import { Signup } from './pages/Signup';
import { VerifyOtp } from './pages/VerifyOtp';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-full">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyJobs />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute>
              <AdminCompanies />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="p-6 text-slate-300">Not found.</div>} />
      </Routes>
    </div>
  );
}
