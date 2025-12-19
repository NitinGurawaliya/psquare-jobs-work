const express = require('express');

const Job = require('../models/Job');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const fields = ['title', 'description', 'location', 'type', 'salary'];
  for (const f of fields) {
    if (req.body[f] !== undefined) job[f] = String(req.body[f] || '');
  }

  if (!String(job.title || '').trim()) return res.status(400).json({ message: 'Job title is required' });

  await job.save();
  return res.json({ job });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  await job.deleteOne();
  return res.json({ message: 'Job deleted' });
});

module.exports = router;
