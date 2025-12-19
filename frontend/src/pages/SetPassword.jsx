import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SetPassword() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const email = useMemo(() => params.get('email') || '', [params]);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    try {
      setLoading(true);
      await apiFetch('/auth/set-password', { method: 'POST', body: { email, password } });
      setInfo('Password set. You can now sign in.');
      nav('/login');
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
          <div className="text-xl font-bold">Set password</div>
          <div className="mt-1 text-sm text-slate-300">Create a password for your account.</div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input label="Email" value={email} readOnly />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />

            {error ? <div className="text-sm text-rose-300">{error}</div> : null}
            {info ? <div className="text-sm text-emerald-300">{info}</div> : null}

            <Button disabled={loading || !email} className="w-full" type="submit">
              {loading ? 'Saving...' : 'Save password'}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
