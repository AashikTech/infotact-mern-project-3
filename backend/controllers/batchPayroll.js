const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

/**
 * Batch payroll processing
 * Generates payroll for multiple employees at once
 */
exports.batchProcessPayroll = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        error: 'Please provide month and year'
      });
    }

    // Get employees to process
    let employees;
    if (employeeIds && employeeIds.length > 0) {
      employees = await Employee.find({ _id: { $in: employeeIds } });
    } else {
      employees = await Employee.find({ isActive: true });
    }

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No employees found to process'
      });
    }

    const results = {
      processed: [],
      skipped: [],
      errors: []
    };

    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existingPayroll = await Payroll.findOne({
          employee: employee._id,
          'payPeriod.month': month,
          'payPeriod.year': year
        });

        if (existingPayroll) {
          results.skipped.push({
            employeeId: employee.employeeId,
            name: `${employee.firstName} ${employee.lastName}`,
            reason: 'Payroll already exists'
          });
          continue;
        }

        // Create payroll record
        const payroll = await Payroll.create({
          employee: employee._id,
          payPeriod: { month, year },
          basicSalary: employee.salary,
          processedBy: req.user.id
        });

        results.processed.push({
          employeeId: employee.employeeId,
          name: `${employee.firstName} ${employee.lastName}`,
          netSalary: payroll.netSalary
        });
      } catch (error) {
        results.errors.push({
          employeeId: employee.employeeId,
          name: `${employee.firstName} ${employee.lastName}`,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      summary: {
        total: employees.length,
        processed: results.processed.length,
        skipped: results.skipped.length,
        errors: results.errors.length
      },
      data: results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

/**
 * Process all pending payrolls for a period
 */
exports.processAllPayrolls = async (req, res) => {
  try {
    const { month, year } = req.params;

    const payrolls = await Payroll.find({
      'payPeriod.month': parseInt(month),
      'payPeriod.year': parseInt(year),
      status: 'draft'
    });

    if (payrolls.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No pending payrolls found for this period'
      });
    }

    const processed = [];
    for (const payroll of payrolls) {
      payroll.status = 'processed';
      await payroll.save();
      processed.push(payroll._id);
    }

    res.status(200).json({
      success: true,
      count: processed.length,
      message: `Processed ${processed.length} payrolls`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
