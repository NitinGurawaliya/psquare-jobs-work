import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <Container>
      <div className="py-8">
        <div className="text-2xl font-bold">Dashboard</div>
        <div className="mt-2 text-slate-300">You are logged in.</div>

        <div className="mt-6">
          <Card>
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-slate-400">Name:</span> {user?.name || '-'}
              </div>
              <div>
                <span className="text-slate-400">Email:</span> {user?.email || '-'}
              </div>
              <div>
                <span className="text-slate-400">Role:</span> {user?.role || '-'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
