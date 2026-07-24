const express = require('express');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');
const { generatePayslip } = require('../utils/pdf');

const router = express.Router();

// @desc    Get payslip PDF
// @route   GET /api/payroll/:id/payslip
// @access  Private
router.get('/:id/payslip', protect, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate({
        path: 'employee',
        populate: { path: 'department', select: 'name' }
      });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        error: 'Payroll record not found'
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePayslip(payroll, payroll.employee);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=payslip-${payroll.employee.employeeId}-${payroll.payPeriod.month}-${payroll.payPeriod.year}.pdf`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
