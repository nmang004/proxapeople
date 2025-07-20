import express from 'express';
import { 
  createResource,
  getAllResources,
  createPermission,
  getAllPermissions,
  assignPermissionToRole,
  getRolePermissions,
  assignPermissionToUser,
  getUserPermissions,
  removeUserPermission
} from '../../shared/middleware/permissions';

const router = express.Router();

// Resource routes
router.get('/resources', getAllResources);
router.post('/resources', createResource);

// Permission routes
router.get('/permissions', getAllPermissions);
router.post('/permissions', createPermission);

// Role permission routes
router.get('/role-permissions/:role', getRolePermissions);
router.post('/role-permissions', assignPermissionToRole);

// User permission routes
router.get('/user-permissions/:userId', getUserPermissions);
router.post('/user-permissions', assignPermissionToUser);
router.delete('/user-permissions/:id', removeUserPermission);

export default router;