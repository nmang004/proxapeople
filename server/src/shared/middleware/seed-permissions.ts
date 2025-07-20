/**
 * Database seed script for RBAC permissions
 * 
 * This script populates the resources, permissions, and role_permissions tables
 * with the permission matrix defined in permission-matrix.ts
 */

import { storage } from '../../database/storage';
import { RESOURCES, ROLE_PERMISSIONS } from './permission-matrix';

export async function seedRBACPermissions(): Promise<void> {
  console.log('🔐 Starting RBAC permission seeding...');

  try {
    // 1. Create all resources
    console.log('📋 Creating resources...');
    const resourceMap = new Map<string, number>();
    
    for (const resourceDef of RESOURCES) {
      try {
        // Check if resource already exists
        const existingResource = await storage.getResourceByName(resourceDef.name);
        
        if (existingResource) {
          console.log(`  ✓ Resource '${resourceDef.name}' already exists`);
          resourceMap.set(resourceDef.name, existingResource.id);
        } else {
          const resource = await storage.createResource({
            name: resourceDef.name,
            displayName: resourceDef.displayName,
            description: resourceDef.description
          });
          console.log(`  ✓ Created resource '${resourceDef.name}'`);
          resourceMap.set(resourceDef.name, resource.id);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create resource '${resourceDef.name}':`, error);
      }
    }

    // 2. Create all permissions for each resource
    console.log('🔑 Creating permissions...');
    const permissionMap = new Map<string, number>();
    
    for (const resourceDef of RESOURCES) {
      const resourceId = resourceMap.get(resourceDef.name);
      if (!resourceId) {
        console.error(`  ❌ Resource '${resourceDef.name}' not found, skipping permissions`);
        continue;
      }

      for (const action of resourceDef.actions) {
        try {
          // Check if permission already exists
          const existingPermissions = await storage.getResourcePermissions(resourceId);
          const existingPermission = existingPermissions.find(p => p.action === action);
          
          if (existingPermission) {
            console.log(`  ✓ Permission '${action}' on '${resourceDef.name}' already exists`);
            permissionMap.set(`${resourceDef.name}:${action}`, existingPermission.id);
          } else {
            const permission = await storage.createPermission({
              resourceId,
              action: action as any, // Cast to enum type
              description: `${action.charAt(0).toUpperCase() + action.slice(1)} access to ${resourceDef.displayName}`
            });
            console.log(`  ✓ Created permission '${action}' on '${resourceDef.name}'`);
            permissionMap.set(`${resourceDef.name}:${action}`, permission.id);
          }
        } catch (error) {
          console.error(`  ❌ Failed to create permission '${action}' on '${resourceDef.name}':`, error);
        }
      }
    }

    // 3. Assign permissions to roles
    console.log('👥 Assigning permissions to roles...');
    
    for (const rolePermission of ROLE_PERMISSIONS) {
      for (const action of rolePermission.actions) {
        try {
          const permissionKey = `${rolePermission.resource}:${action}`;
          const permissionId = permissionMap.get(permissionKey);
          
          if (!permissionId) {
            console.error(`  ❌ Permission '${permissionKey}' not found, skipping`);
            continue;
          }

          // Check if role permission already exists
          const existingRolePermissions = await storage.getRolePermissions(rolePermission.role);
          const hasPermission = existingRolePermissions.some(p => p.id === permissionId);
          
          if (hasPermission) {
            console.log(`  ✓ Role '${rolePermission.role}' already has permission '${action}' on '${rolePermission.resource}'`);
          } else {
            await storage.assignPermissionToRole({
              role: rolePermission.role as any, // Cast to enum type
              permissionId
            });
            console.log(`  ✓ Assigned '${action}' on '${rolePermission.resource}' to role '${rolePermission.role}'`);
          }
        } catch (error) {
          console.error(`  ❌ Failed to assign permission '${action}' on '${rolePermission.resource}' to role '${rolePermission.role}':`, error);
        }
      }
    }

    console.log('✅ RBAC permission seeding completed successfully!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`  • Resources created: ${RESOURCES.length}`);
    console.log(`  • Total permissions: ${RESOURCES.reduce((sum, r) => sum + r.actions.length, 0)}`);
    console.log(`  • Role assignments: ${ROLE_PERMISSIONS.reduce((sum, rp) => sum + rp.actions.length, 0)}`);
    
  } catch (error) {
    console.error('❌ RBAC permission seeding failed:', error);
    throw error;
  }
}

/**
 * Utility function to check current RBAC setup
 */
export async function auditRBACSetup(): Promise<void> {
  console.log('🔍 Auditing current RBAC setup...\n');

  try {
    // Check resources
    const resources = await storage.getAllResources();
    console.log(`📋 Resources (${resources.length}):`);
    for (const resource of resources) {
      const permissions = await storage.getResourcePermissions(resource.id);
      console.log(`  • ${resource.name}: ${permissions.length} permissions`);
    }

    // Check role permissions
    console.log('\n👥 Role Permissions:');
    const roles = ['employee', 'manager', 'hr', 'admin'];
    
    for (const role of roles) {
      const rolePermissions = await storage.getRolePermissions(role);
      console.log(`  • ${role}: ${rolePermissions.length} permissions`);
    }

    console.log('\n✅ RBAC audit completed!');
  } catch (error) {
    console.error('❌ RBAC audit failed:', error);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'seed') {
    seedRBACPermissions()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (command === 'audit') {
    auditRBACSetup()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    console.log('Usage: tsx server/rbac/seed-permissions.ts [seed|audit]');
    process.exit(1);
  }
}