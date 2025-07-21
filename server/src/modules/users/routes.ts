import express from 'express';
import { UserController } from './controller';
import { UserService } from './service';

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

// GET /api/users - Get all users (Auth0 protected)
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get specific user (Auth0 protected)
router.get('/:id', userController.getUser);

// POST /api/users - Create new user (Auth0 protected)
router.post('/', userController.createUser);

export default router;