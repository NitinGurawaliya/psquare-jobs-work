import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    try {
      setLoading(true);
      await apiFetch('/auth/signup', { method: 'POST', body: { name, email } });
      setInfo('OTP sent. Check your email.');
      nav(`/verify?email=${encodeURIComponent(email)}`);
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
          <div className="text-xl font-bold">Sign up</div>
          <div className="mt-1 text-sm text-slate-300">Enter your name and email to receive an OTP.</div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            {error ? <div className="text-sm text-rose-300">{error}</div> : null}
            {info ? <div className="text-sm text-emerald-300">{info}</div> : null}

            <Button disabled={loading} className="w-full" type="submit">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
