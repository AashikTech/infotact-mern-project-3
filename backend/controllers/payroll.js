const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private (HR, Admin)
exports.getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId',
        populate: { path: 'department', select: 'name' }
      })
      .populate('processedBy', 'name')
      .sort('-payPeriod.year -payPeriod.month');

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single payroll record
// @route   GET /api/payroll/:id
// @access  Private
exports.getPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId',
        populate: { path: 'department', select: 'name' }
      })
      .populate('processedBy', 'name');

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Generate payroll for employee
// @route   POST /api/payroll/generate
// @access  Private (HR, Admin)
exports.generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, allowances, deductions, overtime, bonus } = req.body;

    // Check if payroll already exists for this employee and period
    const existingPayroll = await Payroll.findOne({
      employee: employeeId,
      'payPeriod.month': month,
      'payPeriod.year': year
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        error: 'Payroll already exists for this employee and period'
      });
    }

    // Get employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    const payroll = await Payroll.create({
      employee: employeeId,
      payPeriod: { month, year },
      basicSalary: employee.salary,
      allowances: allowances || {},
      deductions: deductions || {},
      overtime: overtime || {},
      bonus: bonus || 0,
      processedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Process payroll (mark as processed)
// @route   PUT /api/payroll/:id/process
// @access  Private (HR, Admin)
exports.processPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    if (payroll.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Payroll has already been processed'
      });
    }

    payroll.status = 'processed';
    await payroll.save();

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Mark payroll as paid
// @route   PUT /api/payroll/:id/pay
// @access  Private (HR, Admin)
exports.markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    if (payroll.status !== 'processed') {
      return res.status(400).json({
        success: false,
        error: 'Payroll must be processed before marking as paid'
      });
    }

    payroll.status = 'paid';
    payroll.paidDate = Date.now();
    await payroll.save();

    res.status(200).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get payroll by employee
// @route   GET /api/payroll/employee/:employeeId
// @access  Private
exports.getPayrollByEmployee = async (req, res) => {
  try {
    const payrolls = await Payroll.find({
      employee: req.params.employeeId
    }).sort('-payPeriod.year -payPeriod.month');

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get payroll summary for a period
// @route   GET /api/payroll/summary/:month/:year
// @access  Private (HR, Admin)
exports.getPayrollSummary = async (req, res) => {
  try {
    const { month, year } = req.params;

    const summary = await Payroll.aggregate([
      {
        $match: {
          'payPeriod.month': parseInt(month),
          'payPeriod.year': parseInt(year)
        }
      },
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalBasicSalary: { $sum: '$basicSalary' },
          totalAllowances: { 
            $sum: { 
              $add: [
                '$allowances.housing',
                '$allowances.transport',
                '$allowances.meal',
                '$allowances.medical',
                '$allowances.other'
              ]
            }
          },
          totalDeductions: {
            $sum: {
              $add: [
                '$deductions.tax',
                '$deductions.insurance',
                '$deductions.providentFund',
                '$deductions.loan',
                '$deductions.other'
              ]
            }
          },
          totalNetSalary: { $sum: '$netSalary' },
          averageSalary: { $avg: '$netSalary' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: summary[0] || {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
