import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { Container } from '../components/Container';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function CompanyJobs() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');

  const canCreate = useMemo(() => isAdmin, [isAdmin]);

  async function load() {
    const [c, j] = await Promise.all([apiFetch(`/companies/${id}`), apiFetch(`/companies/${id}/jobs`)]);
    setCompany(c.company);
    setJobs(j.jobs);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [c, j] = await Promise.all([apiFetch(`/companies/${id}`), apiFetch(`/companies/${id}/jobs`)]);
        if (cancelled) return;
        setCompany(c.company);
        setJobs(j.jobs);
      } catch (e) {
        if (cancelled) return;
        setError(e.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function createJob(e) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch(`/companies/${id}/jobs`, {
        method: 'POST',
        body: { title, location, type, salary, description },
      });
      setTitle('');
      setLocation('');
      setType('');
      setSalary('');
      setDescription('');
      await load();
    } catch (e2) {
      setError(e2.message);
    }
  }

  async function deleteJob(jobId) {
    if (!confirm('Delete this job?')) return;
    setError('');
    try {
      await apiFetch(`/jobs/${jobId}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function updateJob(jobId, patch) {
    setError('');
    try {
      await apiFetch(`/jobs/${jobId}`, { method: 'PUT', body: patch });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Container>
      <div className="py-8">
        <div className="text-2xl font-bold">{company?.name || 'Company'}</div>
        {company?.website ? (
          <a className="mt-2 inline-block text-sm text-indigo-300 hover:text-indigo-200" href={company.website} target="_blank" rel="noreferrer">
            {company.website}
          </a>
        ) : null}
        {company?.description ? <div className="mt-2 text-slate-300">{company.description}</div> : null}

        {error ? <div className="mt-4 text-rose-300">{error}</div> : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <div className="font-semibold">Jobs</div>
            <div className="mt-4 space-y-3">
              {jobs.map((j) => (
                <div key={j._id} className="rounded-xl border border-slate-900 bg-slate-950 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{j.title}</div>
                      <div className="mt-1 text-sm text-slate-400">
                        {j.location || '—'} · {j.type || '—'} · {j.salary || '—'}
                      </div>
                    </div>
                    {isAdmin ? (
                      <Button variant="danger" type="button" onClick={() => deleteJob(j._id)}>
                        Delete
                      </Button>
                    ) : null}
                  </div>

                  {j.description ? <div className="mt-3 text-sm text-slate-300">{j.description}</div> : null}

                  {isAdmin ? (
                    <div className="mt-4 grid gap-2">
                      <div className="text-xs text-slate-400">Quick edit</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                          defaultValue={j.title}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (v && v !== j.title) updateJob(j._id, { title: v });
                          }}
                        />
                        <input
                          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                          defaultValue={j.location || ''}
                          placeholder="Location"
                          onBlur={(e) => updateJob(j._id, { location: e.target.value })}
                        />
                        <input
                          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                          defaultValue={j.type || ''}
                          placeholder="Type"
                          onBlur={(e) => updateJob(j._id, { type: e.target.value })}
                        />
                        <input
                          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                          defaultValue={j.salary || ''}
                          placeholder="Salary"
                          onBlur={(e) => updateJob(j._id, { salary: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              {!jobs.length ? <div className="text-sm text-slate-400">No jobs for this company.</div> : null}
            </div>
          </Card>

          <Card>
            <div className="font-semibold">New Job</div>
            {!canCreate ? (
              <div className="mt-3 text-sm text-slate-400">Admin login required to add jobs.</div>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={createJob}>
                <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <Input label="Type" value={type} onChange={(e) => setType(e.target.value)} placeholder="Full-time / Part-time" />
                <Input label="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
                <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

                <Button className="w-full" type="submit">
                  Create job
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
}
