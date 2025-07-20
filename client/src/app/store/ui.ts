import { createStore } from './index';

// Theme and appearance types
export type Theme = 'light' | 'dark' | 'system';

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms, 0 for persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

export interface ModalState {
  isOpen: boolean;
  component: string | null;
  props?: Record<string, any>;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  pinnedItems: string[];
}

export interface DashboardLayout {
  widgets: {
    id: string;
    type: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    visible: boolean;
    settings?: Record<string, any>;
  }[];
  layout: 'grid' | 'list' | 'compact';
}

interface UIState {
  // Theme and appearance
  theme: Theme;
  
  // Layout state
  sidebar: SidebarState;
  
  // Modal management
  modals: Record<string, ModalState>;
  
  // Notifications/toasts
  notifications: NotificationMessage[];
  
  // Loading states
  globalLoading: boolean;
  loadingMessages: string[];
  
  // Dashboard customization
  dashboardLayout: DashboardLayout;
  
  // User preferences
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    compactMode: boolean;
    animations: boolean;
    soundEffects: boolean;
  };
  
  // Navigation state
  breadcrumbs: { label: string; path: string }[];
  currentPage: string;
  
  // Search state
  globalSearch: {
    isOpen: boolean;
    query: string;
    results: any[];
    isLoading: boolean;
  };
}

interface UIActions {
  // Theme management
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Sidebar management
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapse: () => void;
  pinSidebarItem: (itemId: string) => void;
  unpinSidebarItem: (itemId: string) => void;
  
  // Modal management
  openModal: (modalId: string, component: string, props?: Record<string, any>) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  
  // Notification management
  addNotification: (notification: Omit<NotificationMessage, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading state management
  setGlobalLoading: (loading: boolean, message?: string) => void;
  addLoadingMessage: (message: string) => void;
  removeLoadingMessage: (message: string) => void;
  
  // Dashboard customization
  updateDashboardLayout: (layout: Partial<DashboardLayout>) => void;
  addDashboardWidget: (widget: DashboardLayout['widgets'][0]) => void;
  removeDashboardWidget: (widgetId: string) => void;
  updateDashboardWidget: (widgetId: string, updates: Partial<DashboardLayout['widgets'][0]>) => void;
  resetDashboardLayout: () => void;
  
  // User preferences
  updatePreferences: (preferences: Partial<UIState['preferences']>) => void;
  
  // Navigation
  setBreadcrumbs: (breadcrumbs: { label: string; path: string }[]) => void;
  setCurrentPage: (page: string) => void;
  
  // Global search
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  setGlobalSearchQuery: (query: string) => void;
  setGlobalSearchResults: (results: any[]) => void;
  setGlobalSearchLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

// Default dashboard layout
const defaultDashboardLayout: DashboardLayout = {
  widgets: [
    {
      id: 'stats-overview',
      type: 'stats-cards',
      position: { x: 0, y: 0 },
      size: { width: 12, height: 2 },
      visible: true,
    },
    {
      id: 'team-performance',
      type: 'team-performance',
      position: { x: 0, y: 2 },
      size: { width: 6, height: 4 },
      visible: true,
    },
    {
      id: 'upcoming-reviews',
      type: 'upcoming-reviews',
      position: { x: 6, y: 2 },
      size: { width: 6, height: 4 },
      visible: true,
    },
    {
      id: 'team-goals',
      type: 'team-goals',
      position: { x: 0, y: 6 },
      size: { width: 8, height: 3 },
      visible: true,
    },
    {
      id: 'engagement-score',
      type: 'engagement-score',
      position: { x: 8, y: 6 },
      size: { width: 4, height: 3 },
      visible: true,
    },
  ],
  layout: 'grid',
};

// Generate unique ID for notifications
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Create the UI store
export const useUIStore = createStore<UIStore>(
  'ui',
  (set, get) => ({
    // Initial state
    theme: 'system',
    
    sidebar: {
      isOpen: true,
      isCollapsed: false,
      pinnedItems: ['dashboard', 'employees', 'goals'],
    },
    
    modals: {},
    
    notifications: [],
    
    globalLoading: false,
    loadingMessages: [],
    
    dashboardLayout: defaultDashboardLayout,
    
    preferences: {
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'MM/dd/yyyy',
      compactMode: false,
      animations: true,
      soundEffects: false,
    },
    
    breadcrumbs: [],
    currentPage: 'dashboard',
    
    globalSearch: {
      isOpen: false,
      query: '',
      results: [],
      isLoading: false,
    },

    // Theme management
    setTheme: (theme: Theme) =>
      set((state) => ({ ...state, theme })),

    toggleTheme: () => {
      const { theme } = get();
      const newTheme = theme === 'light' ? 'dark' : 'light';
      set((state) => ({ ...state, theme: newTheme }));
    },

    // Sidebar management
    toggleSidebar: () => {
      const { sidebar } = get();
      set((state) => ({
        ...state,
        sidebar: { ...sidebar, isOpen: !sidebar.isOpen },
      }));
    },

    setSidebarOpen: (isOpen: boolean) => {
      const { sidebar } = get();
      set((state) => ({
        ...state,
        sidebar: { ...sidebar, isOpen },
      }));
    },

    toggleSidebarCollapse: () => {
      const { sidebar } = get();
      set((state) => ({
        ...state,
        sidebar: { ...sidebar, isCollapsed: !sidebar.isCollapsed },
      }));
    },

    pinSidebarItem: (itemId: string) => {
      const { sidebar } = get();
      if (!sidebar.pinnedItems.includes(itemId)) {
        set((state) => ({
          ...state,
          sidebar: {
            ...sidebar,
            pinnedItems: [...sidebar.pinnedItems, itemId],
          },
        }));
      }
    },

    unpinSidebarItem: (itemId: string) => {
      const { sidebar } = get();
      set((state) => ({
        ...state,
        sidebar: {
          ...sidebar,
          pinnedItems: sidebar.pinnedItems.filter(id => id !== itemId),
        },
      }));
    },

    // Modal management
    openModal: (modalId: string, component: string, props?: Record<string, any>) =>
      set((state) => ({
        ...state,
        modals: {
          ...state.modals,
          [modalId]: { isOpen: true, component, props },
        },
      })),

    closeModal: (modalId: string) =>
      set((state) => ({
        ...state,
        modals: {
          ...state.modals,
          [modalId]: { isOpen: false, component: null, props: undefined },
        },
      })),

    closeAllModals: () =>
      set((state) => ({
        ...state,
        modals: {},
      })),

    // Notification management
    addNotification: (notification: Omit<NotificationMessage, 'id' | 'timestamp'>) => {
      const id = generateId();
      const newNotification: NotificationMessage = {
        ...notification,
        id,
        timestamp: Date.now(),
        duration: notification.duration ?? 5000,
      };

      set((state) => ({
        ...state,
        notifications: [newNotification, ...state.notifications],
      }));

      // Auto-remove notification after duration
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          get().removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },

    removeNotification: (id: string) =>
      set((state) => ({
        ...state,
        notifications: state.notifications.filter(n => n.id !== id),
      })),

    clearNotifications: () =>
      set((state) => ({
        ...state,
        notifications: [],
      })),

    // Loading state management
    setGlobalLoading: (loading: boolean, message?: string) => {
      const { loadingMessages } = get();
      set((state) => ({
        ...state,
        globalLoading: loading,
        loadingMessages: message ? [message, ...loadingMessages] : loadingMessages,
      }));
    },

    addLoadingMessage: (message: string) => {
      const { loadingMessages } = get();
      set((state) => ({
        ...state,
        loadingMessages: [message, ...loadingMessages],
        globalLoading: true,
      }));
    },

    removeLoadingMessage: (message: string) => {
      const { loadingMessages } = get();
      const newMessages = loadingMessages.filter(m => m !== message);
      set((state) => ({
        ...state,
        loadingMessages: newMessages,
        globalLoading: newMessages.length > 0,
      }));
    },

    // Dashboard customization
    updateDashboardLayout: (layout: Partial<DashboardLayout>) => {
      const { dashboardLayout } = get();
      set((state) => ({
        ...state,
        dashboardLayout: { ...dashboardLayout, ...layout },
      }));
    },

    addDashboardWidget: (widget: DashboardLayout['widgets'][0]) => {
      const { dashboardLayout } = get();
      set((state) => ({
        ...state,
        dashboardLayout: {
          ...dashboardLayout,
          widgets: [...dashboardLayout.widgets, widget],
        },
      }));
    },

    removeDashboardWidget: (widgetId: string) => {
      const { dashboardLayout } = get();
      set((state) => ({
        ...state,
        dashboardLayout: {
          ...dashboardLayout,
          widgets: dashboardLayout.widgets.filter(w => w.id !== widgetId),
        },
      }));
    },

    updateDashboardWidget: (widgetId: string, updates: Partial<DashboardLayout['widgets'][0]>) => {
      const { dashboardLayout } = get();
      set((state) => ({
        ...state,
        dashboardLayout: {
          ...dashboardLayout,
          widgets: dashboardLayout.widgets.map(w =>
            w.id === widgetId ? { ...w, ...updates } : w
          ),
        },
      }));
    },

    resetDashboardLayout: () =>
      set((state) => ({
        ...state,
        dashboardLayout: defaultDashboardLayout,
      })),

    // User preferences
    updatePreferences: (preferences: Partial<UIState['preferences']>) => {
      const currentPrefs = get().preferences;
      set((state) => ({
        ...state,
        preferences: { ...currentPrefs, ...preferences },
      }));
    },

    // Navigation
    setBreadcrumbs: (breadcrumbs: { label: string; path: string }[]) =>
      set((state) => ({ ...state, breadcrumbs })),

    setCurrentPage: (page: string) =>
      set((state) => ({ ...state, currentPage: page })),

    // Global search
    openGlobalSearch: () =>
      set((state) => ({
        ...state,
        globalSearch: { ...state.globalSearch, isOpen: true },
      })),

    closeGlobalSearch: () =>
      set((state) => ({
        ...state,
        globalSearch: {
          ...state.globalSearch,
          isOpen: false,
          query: '',
          results: [],
        },
      })),

    setGlobalSearchQuery: (query: string) =>
      set((state) => ({
        ...state,
        globalSearch: { ...state.globalSearch, query },
      })),

    setGlobalSearchResults: (results: any[]) =>
      set((state) => ({
        ...state,
        globalSearch: { ...state.globalSearch, results, isLoading: false },
      })),

    setGlobalSearchLoading: (loading: boolean) =>
      set((state) => ({
        ...state,
        globalSearch: { ...state.globalSearch, isLoading: loading },
      })),
  }),
  {
    persist: true, // Persist UI preferences
    devtools: true,
  }
);