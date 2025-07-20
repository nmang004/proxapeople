// Re-export user endpoints (employees are users)
export { users } from '../../../shared/api/endpoints';

// Re-export user-specific hooks
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../../../shared/api/hooks';

// Re-export user-specific types
export type {
  User,
  InsertUser,
  UserFilter,
} from '../../../shared/api/types';

// Export a convenience object for employees API
export const employeesApi = {
  // Endpoints
  ...users,
  
  // Helper functions specific to employees feature
  getFullName: (user: { firstName: string; lastName: string }): string => {
    return `${user.firstName} ${user.lastName}`;
  },

  getInitials: (user: { firstName: string; lastName: string }): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  },

  getRoleDisplayName: (role: 'admin' | 'hr' | 'manager' | 'employee'): string => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'hr':
        return 'HR Manager';
      case 'manager':
        return 'Manager';
      case 'employee':
        return 'Employee';
      default:
        return 'Unknown';
    }
  },

  getRoleColor: (role: 'admin' | 'hr' | 'manager' | 'employee'): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'hr':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  getYearsOfService: (hireDate?: string | null): number | null => {
    if (!hireDate) return null;
    
    const hired = new Date(hireDate);
    const now = new Date();
    const diffTime = now.getTime() - hired.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    
    return Math.floor(diffYears);
  },

  formatHireDate: (hireDate?: string | null): string => {
    if (!hireDate) return 'Unknown';
    
    return new Date(hireDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  isManager: (user: { role: string }): boolean => {
    return ['admin', 'hr', 'manager'].includes(user.role);
  },

  canManageEmployee: (currentUser: { role: string; id: number }, targetUser: { managerId?: number | null }): boolean => {
    // Admins and HR can manage anyone
    if (['admin', 'hr'].includes(currentUser.role)) return true;
    
    // Managers can manage their direct reports
    if (currentUser.role === 'manager' && targetUser.managerId === currentUser.id) return true;
    
    return false;
  },
};