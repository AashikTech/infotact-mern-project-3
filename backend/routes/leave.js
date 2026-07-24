const express = require('express');
const {
  getLeaveRequests,
  getLeaveRequest,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getLeaveRequestsByEmployee
} = require('../controllers/leave');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('hr', 'admin'), getLeaveRequests)
  .post(createLeaveRequest);

router.route('/:id')
  .get(getLeaveRequest);

router.put('/:id/approve', authorize('hr', 'admin'), approveLeaveRequest);
router.put('/:id/reject', authorize('hr', 'admin'), rejectLeaveRequest);

router.get('/employee/:employeeId', getLeaveRequestsByEmployee);

module.exports = router;
