const express = require('express');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentEmployees
} = require('../controllers/department');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDepartments)
  .post(authorize('hr', 'admin'), createDepartment);

router.route('/:id')
  .get(getDepartment)
  .put(authorize('hr', 'admin'), updateDepartment)
  .delete(authorize('admin'), deleteDepartment);

router.get('/:id/employees', getDepartmentEmployees);

module.exports = router;
