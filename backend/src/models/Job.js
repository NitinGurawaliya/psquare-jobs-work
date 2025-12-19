const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    type: { type: String, default: '' },
    salary: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Job', JobSchema);
