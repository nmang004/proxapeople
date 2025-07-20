import express from 'express';
import { DepartmentController } from './controller';
import { DepartmentService } from './service';
import { requirePermission } from '../../shared/middleware/auth';

const router = express.Router();
const departmentService = new DepartmentService();
const departmentController = new DepartmentController(departmentService);

// GET /api/departments - Get all departments (requires departments:view permission)
router.get('/', requirePermission('departments', 'view'), departmentController.getAllDepartments);

// POST /api/departments - Create new department (requires departments:create permission)
router.post('/', requirePermission('departments', 'create'), departmentController.createDepartment);

export default router;