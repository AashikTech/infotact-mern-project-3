const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment
} = require('../controllers/employee');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('hr', 'admin'), getEmployees)
  .post(authorize('hr', 'admin'), createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(authorize('hr', 'admin'), updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

router.get('/department/:departmentId', getEmployeesByDepartment);

module.exports = router;
