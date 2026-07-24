const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payPeriod: {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    }
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    meal: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    tax: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    loan: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  overtime: {
    hours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
  },
  bonus: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid'],
    default: 'draft'
  },
  paidDate: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate net salary before saving
PayrollSchema.pre('save', function(next) {
  // Calculate total allowances
  const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
  
  // Calculate total deductions
  const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
  
  // Calculate overtime amount
  const overtimeAmount = this.overtime.hours * this.overtime.rate;
  
  // Calculate net salary
  this.netSalary = this.basicSalary + totalAllowances + overtimeAmount + this.bonus - totalDeductions;
  
  next();
});

module.exports = mongoose.model('Payroll', PayrollSchema);
