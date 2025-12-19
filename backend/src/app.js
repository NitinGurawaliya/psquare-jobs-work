const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');
const jobRoutes = require('./routes/jobs');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
