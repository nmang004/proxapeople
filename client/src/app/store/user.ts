import { createStore, BaseState, AsyncActions } from './index';
import { User } from './auth';

// Extended user types for directory and profiles
export interface Employee extends User {
  manager?: number; // Manager's user ID
  teamId?: number;
  status: 'active' | 'inactive' | 'pending';
  skills?: string[];
  bio?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Team {
  id: number;
  name: string;
  description: string;
  departmentId: number;
  managerId: number;
  members: number[]; // User IDs
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  managerId: number;
  employees: number[]; // User IDs
  teams: number[]; // Team IDs
  createdAt: string;
  updatedAt: string;
}

interface UserState extends BaseState {
  // Current user's profile (detailed version)
  currentUserProfile: Employee | null;
  
  // Employee directory data
  employees: Employee[];
  filteredEmployees: Employee[];
  
  // Organization structure
  departments: Department[];
  teams: Team[];
  
  // Search and filtering
  searchQuery: string;
  selectedDepartment: number | null;
  selectedTeam: number | null;
  
  // Pagination for large datasets
  currentPage: number;
  pageSize: number;
  totalEmployees: number;
}

interface UserActions extends AsyncActions {
  // Profile management
  fetchCurrentUserProfile: () => Promise<void>;
  updateCurrentUserProfile: (updates: Partial<Employee>) => Promise<void>;
  
  // Employee directory
  fetchEmployees: (page?: number, pageSize?: number) => Promise<void>;
  searchEmployees: (query: string) => void;
  filterByDepartment: (departmentId: number | null) => void;
  filterByTeam: (teamId: number | null) => void;
  clearFilters: () => void;
  
  // Organization structure
  fetchDepartments: () => Promise<void>;
  fetchTeams: () => Promise<void>;
  
  // Individual employee actions
  getEmployeeById: (id: number) => Employee | null;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: number, updates: Partial<Employee>) => Promise<void>;
  deactivateEmployee: (id: number) => Promise<void>;
  
  // Team management
  createTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTeam: (id: number, updates: Partial<Team>) => Promise<void>;
  addTeamMember: (teamId: number, userId: number) => Promise<void>;
  removeTeamMember: (teamId: number, userId: number) => Promise<void>;
}

type UserStore = UserState & UserActions;

// API client for user operations
class UserAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('proxapeople_access_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`/api${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(updates: Partial<Employee>) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async getEmployees(page = 1, pageSize = 50) {
    return this.request(`/users?page=${page}&pageSize=${pageSize}`);
  }

  async getEmployee(id: number) {
    return this.request(`/users/${id}`);
  }

  async createEmployee(employee: Omit<Employee, 'id'>) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateEmployee(id: number, updates: Partial<Employee>) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deactivateEmployee(id: number) {
    return this.request(`/users/${id}/deactivate`, {
      method: 'POST',
    });
  }

  async getDepartments() {
    return this.request('/departments');
  }

  async getTeams() {
    return this.request('/teams');
  }

  async createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: number, updates: Partial<Team>) {
    return this.request(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async addTeamMember(teamId: number, userId: number) {
    return this.request(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async removeTeamMember(teamId: number, userId: number) {
    return this.request(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  }
}

const api = new UserAPI();

// Utility functions for filtering
const applyFilters = (
  employees: Employee[],
  searchQuery: string,
  selectedDepartment: number | null,
  selectedTeam: number | null
): Employee[] => {
  return employees.filter((employee) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matches = 
        fullName.includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.jobTitle.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query);
      
      if (!matches) return false;
    }

    // Department filter
    if (selectedDepartment !== null) {
      // Note: This assumes department names map to IDs - might need adjustment
      // based on actual data structure
      if (employee.department !== selectedDepartment.toString()) return false;
    }

    // Team filter
    if (selectedTeam !== null) {
      if (employee.teamId !== selectedTeam) return false;
    }

    return true;
  });
};

// Create the user store
export const useUserStore = createStore<UserStore>(
  'user',
  (set, get) => ({
    // Initial state
    currentUserProfile: null,
    employees: [],
    filteredEmployees: [],
    departments: [],
    teams: [],
    searchQuery: '',
    selectedDepartment: null,
    selectedTeam: null,
    currentPage: 1,
    pageSize: 50,
    totalEmployees: 0,
    isLoading: false,
    error: null,

    // Async utilities
    setLoading: (loading: boolean) =>
      set((state) => ({ ...state, isLoading: loading })),

    setError: (error: string | null) =>
      set((state) => ({ ...state, error, isLoading: false })),

    clearError: () =>
      set((state) => ({ ...state, error: null })),

    // Profile management
    fetchCurrentUserProfile: async () => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const profile = await api.getCurrentUserProfile();
        
        set((state) => ({
          ...state,
          currentUserProfile: profile,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch profile');
        throw error;
      }
    },

    updateCurrentUserProfile: async (updates: Partial<Employee>) => {
      const { setLoading, setError, currentUserProfile } = get();
      
      if (!currentUserProfile) {
        throw new Error('No current profile to update');
      }

      try {
        setLoading(true);
        setError(null);
        
        const updatedProfile = await api.updateUserProfile(updates);
        
        set((state) => ({
          ...state,
          currentUserProfile: updatedProfile,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update profile');
        throw error;
      }
    },

    // Employee directory
    fetchEmployees: async (page = 1, pageSize = 50) => {
      const { setLoading, setError, searchQuery, selectedDepartment, selectedTeam } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getEmployees(page, pageSize);
        const { employees, total } = response;
        
        const filteredEmployees = applyFilters(
          employees,
          searchQuery,
          selectedDepartment,
          selectedTeam
        );
        
        set((state) => ({
          ...state,
          employees,
          filteredEmployees,
          totalEmployees: total,
          currentPage: page,
          pageSize,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch employees');
        throw error;
      }
    },

    searchEmployees: (query: string) => {
      const { employees, selectedDepartment, selectedTeam } = get();
      
      const filteredEmployees = applyFilters(
        employees,
        query,
        selectedDepartment,
        selectedTeam
      );
      
      set((state) => ({
        ...state,
        searchQuery: query,
        filteredEmployees,
        currentPage: 1, // Reset pagination
      }));
    },

    filterByDepartment: (departmentId: number | null) => {
      const { employees, searchQuery, selectedTeam } = get();
      
      const filteredEmployees = applyFilters(
        employees,
        searchQuery,
        departmentId,
        selectedTeam
      );
      
      set((state) => ({
        ...state,
        selectedDepartment: departmentId,
        filteredEmployees,
        currentPage: 1, // Reset pagination
      }));
    },

    filterByTeam: (teamId: number | null) => {
      const { employees, searchQuery, selectedDepartment } = get();
      
      const filteredEmployees = applyFilters(
        employees,
        searchQuery,
        selectedDepartment,
        teamId
      );
      
      set((state) => ({
        ...state,
        selectedTeam: teamId,
        filteredEmployees,
        currentPage: 1, // Reset pagination
      }));
    },

    clearFilters: () => {
      const { employees } = get();
      
      set((state) => ({
        ...state,
        searchQuery: '',
        selectedDepartment: null,
        selectedTeam: null,
        filteredEmployees: employees,
        currentPage: 1,
      }));
    },

    // Organization structure
    fetchDepartments: async () => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const departments = await api.getDepartments();
        
        set((state) => ({
          ...state,
          departments,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch departments');
        throw error;
      }
    },

    fetchTeams: async () => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const teams = await api.getTeams();
        
        set((state) => ({
          ...state,
          teams,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch teams');
        throw error;
      }
    },

    // Individual employee actions
    getEmployeeById: (id: number) => {
      const { employees } = get();
      return employees.find(emp => emp.id === id) || null;
    },

    addEmployee: async (employee: Omit<Employee, 'id'>) => {
      const { setLoading, setError, fetchEmployees } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.createEmployee(employee);
        
        // Refresh the employees list
        await fetchEmployees();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add employee');
        throw error;
      }
    },

    updateEmployee: async (id: number, updates: Partial<Employee>) => {
      const { setLoading, setError, employees, filteredEmployees } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const updatedEmployee = await api.updateEmployee(id, updates);
        
        const newEmployees = employees.map(emp => 
          emp.id === id ? { ...emp, ...updatedEmployee } : emp
        );
        
        const newFilteredEmployees = filteredEmployees.map(emp => 
          emp.id === id ? { ...emp, ...updatedEmployee } : emp
        );
        
        set((state) => ({
          ...state,
          employees: newEmployees,
          filteredEmployees: newFilteredEmployees,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update employee');
        throw error;
      }
    },

    deactivateEmployee: async (id: number) => {
      const { setLoading, setError, fetchEmployees } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.deactivateEmployee(id);
        
        // Refresh the employees list
        await fetchEmployees();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to deactivate employee');
        throw error;
      }
    },

    // Team management
    createTeam: async (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { setLoading, setError, fetchTeams } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.createTeam(team);
        
        // Refresh the teams list
        await fetchTeams();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create team');
        throw error;
      }
    },

    updateTeam: async (id: number, updates: Partial<Team>) => {
      const { setLoading, setError, teams } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        const updatedTeam = await api.updateTeam(id, updates);
        
        const newTeams = teams.map(team => 
          team.id === id ? { ...team, ...updatedTeam } : team
        );
        
        set((state) => ({
          ...state,
          teams: newTeams,
          isLoading: false,
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update team');
        throw error;
      }
    },

    addTeamMember: async (teamId: number, userId: number) => {
      const { setLoading, setError, fetchTeams } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.addTeamMember(teamId, userId);
        
        // Refresh the teams list
        await fetchTeams();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add team member');
        throw error;
      }
    },

    removeTeamMember: async (teamId: number, userId: number) => {
      const { setLoading, setError, fetchTeams } = get();
      
      try {
        setLoading(true);
        setError(null);
        
        await api.removeTeamMember(teamId, userId);
        
        // Refresh the teams list
        await fetchTeams();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to remove team member');
        throw error;
      }
    },
  }),
  {
    persist: false, // Don't persist user data for security
    devtools: true,
  }
);