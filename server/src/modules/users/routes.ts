import express from 'express';
import { UserController } from './controller';
import { UserService } from './service';
import { requirePermission } from '../../shared/middleware/auth';

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

// GET /api/users - Get all users (requires users:view permission)
router.get('/', requirePermission('users', 'view'), userController.getAllUsers);

// GET /api/users/:id - Get specific user (own profile or users:view permission)
router.get('/:id', userController.getUser);

// POST /api/users - Create new user (requires users:create permission)
router.post('/', requirePermission('users', 'create'), userController.createUser);

export default router;