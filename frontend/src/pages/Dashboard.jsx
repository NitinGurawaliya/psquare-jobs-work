import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <Container>
      <div className="py-8">
        <div className="text-2xl font-bold">Dashboard</div>
        <div className="mt-2 text-slate-300">Welcome back, {user?.name || 'User'}!</div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <div className="font-semibold">Your Profile</div>
            <div className="mt-4 grid gap-2 text-sm">
              <div>
                <span className="text-slate-400">Name:</span> {user?.name || '-'}
              </div>
              <div>
                <span className="text-slate-400">Email:</span> {user?.email || '-'}
              </div>
            </div>
          </Card>

          <Card>
            <div className="font-semibold">Quick Actions</div>
            <div className="mt-4 space-y-3">
              <Link to="/admin/companies" className="block">
                <Button className="w-full" variant="primary">
                  Manage Companies & Jobs
                </Button>
              </Link>
              <Link to="/companies" className="block">
                <Button className="w-full" variant="secondary">
                  Browse All Companies
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
