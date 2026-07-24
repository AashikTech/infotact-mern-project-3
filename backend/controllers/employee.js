const Employee = require('../models/Employee');
const Department = require('../models/Department');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (HR, Admin)
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('department', 'name')
      .populate('user', 'email role');
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name description')
      .populate('user', 'email role');

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (HR, Admin)
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (HR, Admin)
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get employees by department
// @route   GET /api/employees/department/:departmentId
// @access  Private
exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await Employee.find({ 
      department: req.params.departmentId 
    }).populate('department', 'name');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
