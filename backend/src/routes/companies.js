const express = require('express');

const Company = require('../models/Company');
const Job = require('../models/Job');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  return res.status(200).json({
    message: 'Companies found',
    success: true,
    data: companies,
  });
});

router.get('/:id', async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company){
    return res.status(404).json({ 
      message: 'Company not found'
     });
  }
  return res.status(200).json({
    message: 'Company found',
    success: true,
    data: company,
  });
});

router.get('/:id/jobs', async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company)
    {
      return res.status(404).json({ 
        message: 'Company not found',
        success: false,
      }); 
    }

  const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });
  return res.status(200).json({
    message: 'Jobs found',
    success: true,
    data: jobs,
  });
});

router.post('/', requireAuth, async (req, res) => {
  const name = String(req.body.name || '').trim();
  const website = String(req.body.website || '').trim();
  const description = String(req.body.description || '').trim();

  if (!name)
    {
      return res.status(400).json({ 
        message: 'Company name is required',
        success: false,
      });
    }

  const company = await Company.create({ name,
     website,
     description,
    });

  return res.status(201).json({
    message: 'Company created',
    success: true,
    data: company,
  });
});

router.post('/:id/jobs', requireAuth, async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company)
    {
      return res.status(404).json({ 
        message: 'Company not found',
        success: false,
      });
    }

  const title = String(req.body.title || '').trim();
  const description = String(req.body.description || '').trim();
  const location = String(req.body.location || '').trim();
  const type = String(req.body.type || '').trim();
  const salary = String(req.body.salary || '').trim();

  if (!title)
    {
      return res.status(400).json({ 
        message: 'Job title is required',
        success: false,
      });
    }

  const job = await Job.create({ company: company._id,
     title,
     description,
     location,
     type,
     salary,
    });

  return res.status(201).json({
    message: 'Job created',
    success: true,
    data: job,
  });
});

  router.delete('/:id', requireAuth, async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company)
    {
      return res.status(404).json({ 
        message: 'Company not found',
        success: false,
      });
    }

  await Job.deleteMany({ company: company._id });
  await company.deleteOne();

  return res.status(200).json({
    message: 'Company deleted',
    success: true,
  });
});

module.exports = router;
