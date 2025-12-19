import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Container } from '../components/Container';
import { Card } from '../components/Card';

export function Companies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiFetch('/companies')
      .then((d) => {
        // Backend returns { success, message, data: companies[] }
        if (!cancelled) setCompanies(d.data || []);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container>
      <div className="py-8">
        <div className="text-2xl font-bold">Companies</div>
        {error ? <div className="mt-3 text-rose-300">{error}</div> : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <Card key={c._id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  {c.website ? (
                    <a className="mt-1 block text-sm text-indigo-300 hover:text-indigo-200" href={c.website} target="_blank" rel="noreferrer">
                      {c.website}
                    </a>
                  ) : null}
                  {c.description ? <div className="mt-2 text-sm text-slate-300">{c.description}</div> : null}
                </div>

                <Link
                  className="shrink-0 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-800"
                  to={`/companies/${c._id}`}
                >
                  View jobs
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {!companies.length && !error ? <div className="mt-6 text-slate-400">No companies yet.</div> : null}
      </div>
    </Container>
  );
}
