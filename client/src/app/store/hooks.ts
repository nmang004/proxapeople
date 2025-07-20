// Convenience hooks for accessing store state and actions
import { useAuthStore } from './auth';
import { usePermissionsStore } from './permissions';
import { useUIStore } from './ui';
import { useUserStore } from './user';

// Auth hooks
export const useAuth = () => {
  const auth = useAuthStore((state: any) => ({
    user: state.user,
    tokens: state.tokens,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const actions = useAuthStore((state: any) => ({
    login: state.login,
    register: state.register,
    logout: state.logout,
    refreshToken: state.refreshToken,
    updateUser: state.updateUser,
    clearError: state.clearError,
  }));

  return { ...auth, ...actions };
};

// Permissions hooks
export const usePermissions = () => {
  const permissions = usePermissionsStore((state) => ({
    userPermissions: state.userPermissions,
    resources: state.resources,
    roles: state.roles,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const actions = usePermissionsStore((state) => ({
    hasPermission: state.hasPermission,
    checkPermission: state.checkPermission,
    checkPermissions: state.checkPermissions,
    refreshPermissions: state.refreshPermissions,
    clearError: state.clearError,
  }));

  return { ...permissions, ...actions };
};

// UI hooks
export const useUI = () => {
  const ui = useUIStore((state) => ({
    theme: state.theme,
    sidebar: state.sidebar,
    modals: state.modals,
    notifications: state.notifications,
    globalLoading: state.globalLoading,
    loadingMessages: state.loadingMessages,
    dashboardLayout: state.dashboardLayout,
    preferences: state.preferences,
    breadcrumbs: state.breadcrumbs,
    currentPage: state.currentPage,
    globalSearch: state.globalSearch,
  }));

  const actions = useUIStore((state) => ({
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebarCollapse: state.toggleSidebarCollapse,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
    setGlobalLoading: state.setGlobalLoading,
    updatePreferences: state.updatePreferences,
    setBreadcrumbs: state.setBreadcrumbs,
    setCurrentPage: state.setCurrentPage,
    openGlobalSearch: state.openGlobalSearch,
    closeGlobalSearch: state.closeGlobalSearch,
    setGlobalSearchQuery: state.setGlobalSearchQuery,
  }));

  return { ...ui, ...actions };
};

// User management hooks
export const useUsers = () => {
  const users = useUserStore((state) => ({
    currentUserProfile: state.currentUserProfile,
    employees: state.employees,
    filteredEmployees: state.filteredEmployees,
    departments: state.departments,
    teams: state.teams,
    searchQuery: state.searchQuery,
    selectedDepartment: state.selectedDepartment,
    selectedTeam: state.selectedTeam,
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    totalEmployees: state.totalEmployees,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const actions = useUserStore((state) => ({
    fetchCurrentUserProfile: state.fetchCurrentUserProfile,
    updateCurrentUserProfile: state.updateCurrentUserProfile,
    fetchEmployees: state.fetchEmployees,
    searchEmployees: state.searchEmployees,
    filterByDepartment: state.filterByDepartment,
    filterByTeam: state.filterByTeam,
    clearFilters: state.clearFilters,
    fetchDepartments: state.fetchDepartments,
    fetchTeams: state.fetchTeams,
    getEmployeeById: state.getEmployeeById,
    addEmployee: state.addEmployee,
    updateEmployee: state.updateEmployee,
    deactivateEmployee: state.deactivateEmployee,
    clearError: state.clearError,
  }));

  return { ...users, ...actions };
};

// Specialized hooks for common use cases

// Hook for getting current user info
export const useCurrentUser = () => {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
};

// Hook for theme management
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  return { theme, setTheme, toggleTheme };
};

// Hook for notifications
export const useNotifications = () => {
  const notifications = useUIStore((state) => state.notifications);
  const addNotification = useUIStore((state) => state.addNotification);
  const removeNotification = useUIStore((state) => state.removeNotification);
  const clearNotifications = useUIStore((state) => state.clearNotifications);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};

// Hook for modal management
export const useModals = () => {
  const modals = useUIStore((state) => state.modals);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeAllModals = useUIStore((state) => state.closeAllModals);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
};

// Hook for loading states
export const useLoading = () => {
  const globalLoading = useUIStore((state) => state.globalLoading);
  const loadingMessages = useUIStore((state) => state.loadingMessages);
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  const addLoadingMessage = useUIStore((state) => state.addLoadingMessage);
  const removeLoadingMessage = useUIStore((state) => state.removeLoadingMessage);

  return {
    globalLoading,
    loadingMessages,
    setGlobalLoading,
    addLoadingMessage,
    removeLoadingMessage,
  };
};

// Hook for sidebar management
export const useSidebar = () => {
  const sidebar = useUIStore((state) => state.sidebar);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const toggleSidebarCollapse = useUIStore((state) => state.toggleSidebarCollapse);
  const pinSidebarItem = useUIStore((state) => state.pinSidebarItem);
  const unpinSidebarItem = useUIStore((state) => state.unpinSidebarItem);

  return {
    ...sidebar,
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarCollapse,
    pinSidebarItem,
    unpinSidebarItem,
  };
};

// Hook for permission checking
export const usePermissionCheck = (resource: string, action: string) => {
  const hasPermission = usePermissionsStore((state) => state.hasPermission);
  const checkPermission = usePermissionsStore((state) => state.checkPermission);

  return {
    hasPermission: () => hasPermission(resource, action),
    checkPermission: () => checkPermission(resource, action),
  };
};

// Hook for role-based access
export const useRole = () => {
  const user = useAuthStore((state) => state.user);
  
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr' || isAdmin;
  const isManager = user?.role === 'manager' || isHR;
  const isEmployee = !!user;

  return {
    user,
    role: user?.role,
    isAdmin,
    isHR,
    isManager,
    isEmployee,
  };
};