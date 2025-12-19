const Job = require('../models/Job');

async function updatejob(req, res) {
        const job = await Job.findById(req.params.id);
        if (!job)
          {
            return res.status(404).json({ 
              message: 'Job not found',
              success: false,
            });
          }
      
        const fields = ['title', 'description', 'location', 'type', 'salary'];
        for (const f of fields) {
          if (req.body[f] !== undefined) job[f] = String(req.body[f] || '');
        }
      
        if (!String(job.title || '').trim()) 
          {
            return res.status(400).json({ 
              message: 'Job title is required',
              success: false,
            });
          }
      
        await job.save();
      
        return res.status(200).json({
          message: 'Job updated',
          success: true,
          data: job,
        });
      
}



  async function deletejob(req, res) {
    const job = await Job.findById(req.params.id);
    if (!job)
        {
        return res.status(404).json({ 
            message: 'Job not found',
            success: false,
        });
        }

    await job.deleteOne();
    return res.status(200).json({
        message: 'Job deleted',
        success: true,
    });
}

module.exports = {
    updatejob,
    deletejob
};
