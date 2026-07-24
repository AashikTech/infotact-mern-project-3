const express = require('express');
const {
  batchProcessPayroll,
  processAllPayrolls
} = require('../controllers/batchPayroll');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('hr', 'admin'));

router.post('/batch', batchProcessPayroll);
router.put('/process-all/:month/:year', processAllPayrolls);

module.exports = router;
