import { Router } from "express";
import * as permissionController from "../controllers/permissions";
import { requirePermission } from "../utils/permissions";

const router = Router();

// Resource routes
router.post(
  '/resources', 
  requirePermission('resources', 'create'),
  permissionController.createResource
);

router.get(
  '/resources',
  permissionController.getAllResources
);

router.get(
  '/resources/:id',
  permissionController.getResourceById
);

// Permission routes
router.post(
  '/permissions',
  requirePermission('permissions', 'create'),
  permissionController.createPermission
);

router.get(
  '/permissions',
  permissionController.getAllPermissions
);

router.get(
  '/resources/:resourceId/permissions',
  permissionController.getResourcePermissions
);

// Role permission routes
router.post(
  '/role-permissions',
  requirePermission('role_permissions', 'create'),
  permissionController.assignPermissionToRole
);

router.get(
  '/roles/:role/permissions',
  permissionController.getRolePermissions
);

router.delete(
  '/role-permissions/:id',
  requirePermission('role_permissions', 'delete'),
  permissionController.removeRolePermission
);

// User permission routes
router.post(
  '/user-permissions',
  requirePermission('user_permissions', 'create'),
  permissionController.assignPermissionToUser
);

router.get(
  '/users/:userId/permissions',
  permissionController.getUserPermissions
);

router.delete(
  '/user-permissions/:id',
  requirePermission('user_permissions', 'delete'),
  permissionController.removeUserPermission
);

// Permission check routes
router.post(
  '/check-permission',
  permissionController.checkPermission
);

router.post(
  '/check-my-permission',
  permissionController.checkCurrentUserPermission
);

export default router;