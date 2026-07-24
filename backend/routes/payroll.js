const express = require('express');
const {
  getPayrolls,
  getPayroll,
  generatePayroll,
  processPayroll,
  markAsPaid,
  getPayrollByEmployee,
  getPayrollSummary
} = require('../controllers/payroll');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('hr', 'admin'), getPayrolls);

router.route('/generate')
  .post(authorize('hr', 'admin'), generatePayroll);

router.route('/summary/:month/:year')
  .get(authorize('hr', 'admin'), getPayrollSummary);

router.route('/:id')
  .get(getPayroll);

router.put('/:id/process', authorize('hr', 'admin'), processPayroll);
router.put('/:id/pay', authorize('hr', 'admin'), markAsPaid);

router.get('/employee/:employeeId', getPayrollByEmployee);

module.exports = router;
