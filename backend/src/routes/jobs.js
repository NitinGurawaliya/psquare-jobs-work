const express = require('express');

const { requireAuth } = require('../middleware/auth');
const { deletejob, updatejob } = require('../controllers/job.controller');

const router = express.Router();

router.put('/:id', requireAuth, updatejob);

  router.delete('/:id', requireAuth, deletejob);

module.exports = router;
