const PDFDocument = require('pdfkit');

/**
 * Generate payslip PDF
 * @param {Object} payroll - Payroll data
 * @param {Object} employee - Employee data
 * @returns {Promise<Buffer>} PDF buffer
 */
const generatePayslip = (payroll, employee) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Company Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Enterprise HRMS', { align: 'center' })
        .fontSize(10)
        .font('Helvetica')
        .text('Payroll Management System', { align: 'center' })
        .moveDown(0.5);

      // Line separator
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(1);

      // Payslip Title
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('PAYSLIP', { align: 'center' })
        .moveDown(1);

      // Employee Information
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Employee Information')
        .moveDown(0.3);

      const empInfo = [
        ['Name:', `${employee.firstName} ${employee.lastName}`],
        ['Employee ID:', employee.employeeId],
        ['Department:', employee.department?.name || 'N/A'],
        ['Position:', employee.position],
        ['Pay Period:', `${getMonthName(payroll.payPeriod.month)} ${payroll.payPeriod.year}`]
      ];

      empInfo.forEach(([label, value]) => {
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(label, 70, doc.y, { continued: true })
          .font('Helvetica')
          .text(` ${value}`)
          .moveDown(0.2);
      });

      doc.moveDown(0.5);

      // Earnings Section
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Earnings')
        .moveDown(0.3);

      const earnings = [
        ['Basic Salary:', formatCurrency(payroll.basicSalary)],
        ['Housing Allowance:', formatCurrency(payroll.allowances.housing)],
        ['Transport Allowance:', formatCurrency(payroll.allowances.transport)],
        ['Meal Allowance:', formatCurrency(payroll.allowances.meal)],
        ['Medical Allowance:', formatCurrency(payroll.allowances.medical)],
        ['Other Allowances:', formatCurrency(payroll.allowances.other)],
        ['Overtime:', formatCurrency(payroll.overtime.amount)],
        ['Bonus:', formatCurrency(payroll.bonus)]
      ];

      earnings.forEach(([label, value]) => {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(label, 70, doc.y, { continued: true })
          .text(value, { align: 'right', width: 400 })
          .moveDown(0.2);
      });

      doc.moveDown(0.5);

      // Deductions Section
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Deductions')
        .moveDown(0.3);

      const deductions = [
        ['Tax:', formatCurrency(payroll.deductions.tax)],
        ['Insurance:', formatCurrency(payroll.deductions.insurance)],
        ['Provident Fund:', formatCurrency(payroll.deductions.providentFund)],
        ['Loan:', formatCurrency(payroll.deductions.loan)],
        ['Other Deductions:', formatCurrency(payroll.deductions.other)]
      ];

      deductions.forEach(([label, value]) => {
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(label, 70, doc.y, { continued: true })
          .text(value, { align: 'right', width: 400 })
          .moveDown(0.2);
      });

      doc.moveDown(0.5);

      // Line separator
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(0.5);

      // Net Salary
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Net Salary:', 70, doc.y, { continued: true })
        .text(formatCurrency(payroll.netSalary), { align: 'right', width: 400 });

      doc.moveDown(2);

      // Footer
      doc
        .fontSize(8)
        .font('Helvetica')
        .text('This is a computer-generated document. No signature is required.', { align: 'center' })
        .moveDown(0.2)
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Format number as currency
 * @param {number} amount 
 * @returns {string}
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

/**
 * Get month name from month number
 * @param {number} month 
 * @returns {string}
 */
const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || 'Unknown';
};

module.exports = {
  generatePayslip,
  formatCurrency,
  getMonthName
};
