const LeaveRequest = require('../models/LeaveRequest');
const Employee = require('../models/Employee');

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private (HR, Admin)
exports.getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId',
        populate: { path: 'department', select: 'name' }
      })
      .populate('approvedBy', 'name');

    res.status(200).json({
      success: true,
      count: leaveRequests.length,
      data: leaveRequests
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single leave request
// @route   GET /api/leaves/:id
// @access  Private
exports.getLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId',
        populate: { path: 'department', select: 'name' }
      })
      .populate('approvedBy', 'name');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create leave request
// @route   POST /api/leaves
// @access  Private (Employee)
exports.createLeaveRequest = async (req, res) => {
  try {
    // Add employee from logged in user
    req.body.employee = req.user.employeeId;

    const leaveRequest = await LeaveRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: leaveRequest
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Approve leave request
// @route   PUT /api/leaves/:id/approve
// @access  Private (HR, Admin)
exports.approveLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Leave request has already been processed'
      });
    }

    leaveRequest.status = 'approved';
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.approvalDate = Date.now();
    leaveRequest.comments = req.body.comments || 'Approved';

    await leaveRequest.save();

    res.status(200).json({
      success: true,
      data: leaveRequest
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Reject leave request
// @route   PUT /api/leaves/:id/reject
// @access  Private (HR, Admin)
exports.rejectLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        error: 'Leave request not found'
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Leave request has already been processed'
      });
    }

    leaveRequest.status = 'rejected';
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.approvalDate = Date.now();
    leaveRequest.comments = req.body.comments || 'Rejected';

    await leaveRequest.save();

    res.status(200).json({
      success: true,
      data: leaveRequest
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get leave requests by employee
// @route   GET /api/leaves/employee/:employeeId
// @access  Private
exports.getLeaveRequestsByEmployee = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({
      employee: req.params.employeeId
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: leaveRequests.length,
      data: leaveRequests
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
