const express = require('express');

const Company = require('../models/Company');
const Job = require('../models/Job');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  return res.json({ companies });
});

router.get('/:id', async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json({ company });
});

router.get('/:id/jobs', async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) return res.status(404).json({ message: 'Company not found' });

  const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });
  return res.json({ jobs });
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const name = String(req.body.name || '').trim();
  const website = String(req.body.website || '').trim();
  const description = String(req.body.description || '').trim();

  if (!name) return res.status(400).json({ message: 'Company name is required' });

  const company = await Company.create({ name, website, description });
  return res.status(201).json({ company });
});

router.post('/:id/jobs', requireAuth, requireAdmin, async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) return res.status(404).json({ message: 'Company not found' });

  const title = String(req.body.title || '').trim();
  const description = String(req.body.description || '').trim();
  const location = String(req.body.location || '').trim();
  const type = String(req.body.type || '').trim();
  const salary = String(req.body.salary || '').trim();

  if (!title) return res.status(400).json({ message: 'Job title is required' });

  const job = await Job.create({ company: company._id, title, description, location, type, salary });
  return res.status(201).json({ job });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) return res.status(404).json({ message: 'Company not found' });

  await Job.deleteMany({ company: company._id });
  await company.deleteOne();

  return res.json({ message: 'Company deleted' });
});

module.exports = router;
