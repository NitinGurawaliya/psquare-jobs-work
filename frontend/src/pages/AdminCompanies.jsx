import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const d = await apiFetch('/companies');
    setCompanies(d.companies);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await apiFetch('/companies', { method: 'POST', body: { name, website, description } });
      setName('');
      setWebsite('');
      setDescription('');
      await load();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete company and all its jobs?')) return;
    setError('');
    try {
      await apiFetch(`/companies/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Container>
      <div className="py-8">
        <div className="text-2xl font-bold">Admin Dashboard</div>
        <div className="mt-1 text-slate-300">Create and manage companies + jobs.</div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <div className="font-semibold">New Company</div>
            <form className="mt-4 space-y-3" onSubmit={onCreate}>
              <Input label="Company name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

              {error ? <div className="text-sm text-rose-300">{error}</div> : null}

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </form>
          </Card>

          <Card>
            <div className="font-semibold">Companies</div>
            <div className="mt-4 space-y-3">
              {companies.map((c) => (
                <div key={c._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-900 bg-slate-950 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="truncate text-xs text-slate-400">{c._id}</div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800"
                      to={`/companies/${c._id}`}
                    >
                      Jobs
                    </Link>
                    <Button variant="danger" onClick={() => onDelete(c._id)} type="button">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {!companies.length ? <div className="text-sm text-slate-400">No companies yet.</div> : null}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
