const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['sick', 'vacation', 'personal', 'maternity', 'paternity', 'unpaid'],
    required: [true, 'Please select a leave type']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason'],
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  comments: {
    type: String,
    maxlength: [500, 'Comments cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total days
LeaveRequestSchema.virtual('totalDays').get(function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end days
});

// Ensure virtuals are serialized
LeaveRequestSchema.set('toJSON', { virtuals: true });
LeaveRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
