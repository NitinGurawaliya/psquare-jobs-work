import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card } from '../components/Card';

export function Home() {
  return (
    <Container>
      <div className="py-10">
        <div className="text-3xl font-bold">MERN Job Bank</div>
        <div className="mt-2 max-w-2xl text-slate-300">
          Sign up with OTP, set password, then manage companies and job postings with a secure JWT-based login.
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Create account
          </Link>
          <Link
            to="/companies"
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
          >
            Browse companies
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card>
            <div className="font-semibold">1) Sign up</div>
            <div className="mt-2 text-sm text-slate-300">Email + Name → OTP sent (expires in 2 minutes).</div>
          </Card>
          <Card>
            <div className="font-semibold">2) Verify OTP</div>
            <div className="mt-2 text-sm text-slate-300">Enter OTP within 2 minutes → proceed to set password.</div>
          </Card>
          <Card>
            <div className="font-semibold">3) Login</div>
            <div className="mt-2 text-sm text-slate-300">JWT token issued → Dashboard / Admin pages.</div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
