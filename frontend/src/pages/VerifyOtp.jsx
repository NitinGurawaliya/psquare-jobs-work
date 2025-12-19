import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function VerifyOtp() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const email = useMemo(() => params.get('email') || '', [params]);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await apiFetch('/auth/verify-otp', { method: 'POST', body: { email, otp } });
      nav(`/set-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="py-10">
        <Card className="mx-auto max-w-md">
          <div className="text-xl font-bold">Verify OTP</div>
          <div className="mt-1 text-sm text-slate-300">OTP expires in 2 minutes.</div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input label="Email" value={email} readOnly />
            <Input
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              inputMode="numeric"
              required
            />

            {error ? <div className="text-sm text-rose-300">{error}</div> : null}

            <Button disabled={loading || !email} className="w-full" type="submit">
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
