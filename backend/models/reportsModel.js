const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'branchs',
  },
  type: {
    type: String,
    enum: ['inventory', 'sales'],
    required: true,
  },
  reportFile:{
    type: String
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
},{timestamps: true})

const ReportsModel = mongoose.model('reports', ReportSchema);
module.exports = ReportsModel;
