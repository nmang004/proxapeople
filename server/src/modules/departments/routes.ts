import express from 'express';
import { DepartmentController } from './controller';
import { DepartmentService } from './service';

const router = express.Router();
const departmentService = new DepartmentService();
const departmentController = new DepartmentController(departmentService);

// GET /api/departments - Get all departments (Auth0 protected)
router.get('/', departmentController.getAllDepartments);

// POST /api/departments - Create new department (Auth0 protected)
router.post('/', departmentController.createDepartment);

export default router;