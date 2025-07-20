import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
import { 
  User,
  Department,
  Team,
  Goal,
  OneOnOneMeeting,
  PerformanceReview,
  Survey,
  PaginationParams,
  UserFilter,
  GoalFilter,
  MeetingFilter,
  ReviewFilter,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PermissionCheckRequest,
  PermissionCheckResponse,
} from './types';
import { api } from './endpoints';
import { ApiError } from './client';

// Query Key Factory - Hierarchical, type-safe query keys
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    permissions: (userId?: number) => [...queryKeys.auth.all, 'permissions', userId] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: PaginationParams & UserFilter) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },

  // Departments
  departments: {
    all: ['departments'] as const,
    lists: () => [...queryKeys.departments.all, 'list'] as const,
    list: (params?: PaginationParams) => [...queryKeys.departments.lists(), params] as const,
    details: () => [...queryKeys.departments.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.departments.details(), id] as const,
  },

  // Teams
  teams: {
    all: ['teams'] as const,
    lists: () => [...queryKeys.teams.all, 'list'] as const,
    list: (params?: PaginationParams) => [...queryKeys.teams.lists(), params] as const,
    details: () => [...queryKeys.teams.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.teams.details(), id] as const,
  },

  // Goals
  goals: {
    all: ['goals'] as const,
    lists: () => [...queryKeys.goals.all, 'list'] as const,
    list: (params?: PaginationParams & GoalFilter) => [...queryKeys.goals.lists(), params] as const,
    details: () => [...queryKeys.goals.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.goals.details(), id] as const,
  },

  // Meetings
  meetings: {
    all: ['meetings'] as const,
    lists: () => [...queryKeys.meetings.all, 'list'] as const,
    list: (params?: PaginationParams & MeetingFilter) => [...queryKeys.meetings.lists(), params] as const,
    details: () => [...queryKeys.meetings.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.meetings.details(), id] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (params?: PaginationParams & ReviewFilter) => [...queryKeys.reviews.lists(), params] as const,
    details: () => [...queryKeys.reviews.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.reviews.details(), id] as const,
  },

  // Surveys
  surveys: {
    all: ['surveys'] as const,
    lists: () => [...queryKeys.surveys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...queryKeys.surveys.lists(), params] as const,
    details: () => [...queryKeys.surveys.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.surveys.details(), id] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    team: (teamId?: number) => [...queryKeys.analytics.all, 'team', teamId] as const,
    department: (departmentId?: number) => [...queryKeys.analytics.all, 'department', departmentId] as const,
  },

  // Permissions
  permissions: {
    all: ['permissions'] as const,
    check: (request: PermissionCheckRequest) => [...queryKeys.permissions.all, 'check', request] as const,
    user: (userId?: number) => [...queryKeys.permissions.all, 'user', userId] as const,
    role: (role: string) => [...queryKeys.permissions.all, 'role', role] as const,
  },
} as const;

// Hook factory for creating typed hooks
function createQueryHook<TData, TError = ApiError>(
  keyFactory: (...args: any[]) => QueryKey,
  queryFn: (...args: any[]) => Promise<TData>
) {
  return (
    ...args: Parameters<typeof keyFactory>
  ) => {
    const options = args[args.length - 1] as UseQueryOptions<TData, TError> | undefined;
    const queryArgs = options ? args.slice(0, -1) : args;
    
    return useQuery<TData, TError>({
      queryKey: keyFactory(...queryArgs),
      queryFn: () => queryFn(...queryArgs),
      ...options,
    });
  };
}

function createMutationHook<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccessInvalidate?: (data: TData, variables: TVariables) => QueryKey[];
  }
) {
  return (mutationOptions?: UseMutationOptions<TData, TError, TVariables>) => {
    const queryClient = useQueryClient();
    
    return useMutation<TData, TError, TVariables>({
      mutationFn,
      onSuccess: (data, variables, context) => {
        // Auto-invalidate related queries
        if (options?.onSuccessInvalidate) {
          const keysToInvalidate = options.onSuccessInvalidate(data, variables);
          keysToInvalidate.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
        
        // Call user's onSuccess
        mutationOptions?.onSuccess?.(data, variables, context);
      },
      ...mutationOptions,
    });
  };
}

// Auth Hooks
export const useCurrentUser = createQueryHook(
  queryKeys.auth.user,
  () => api.auth.me.execute().then(res => res.user)
);

export const useUserPermissions = createQueryHook(
  queryKeys.auth.permissions,
  (userId?: number) => api.permissions.listUserPermissions.execute(userId).then(res => res.permissions)
);

export const useLogin = createMutationHook(
  (data: LoginRequest) => api.auth.login.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.auth.user()],
  }
);

export const useRegister = createMutationHook(
  (data: RegisterRequest) => api.auth.register.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.auth.user()],
  }
);

export const useLogout = createMutationHook(
  () => api.auth.logout.execute(),
  {
    onSuccessInvalidate: () => [queryKeys.auth.all],
  }
);

export const useForgotPassword = createMutationHook(
  (data: ForgotPasswordRequest) => api.auth.forgotPassword.execute(data)
);

export const useResetPassword = createMutationHook(
  (data: ResetPasswordRequest) => api.auth.resetPassword.execute(data)
);

// User Hooks
export const useUsers = createQueryHook(
  queryKeys.users.list,
  (params?: PaginationParams & UserFilter) => api.users.list.execute(params)
);

export const useUser = createQueryHook(
  queryKeys.users.detail,
  (id: number) => api.users.read.execute(id)
);

export const useCreateUser = createMutationHook(
  (data: Parameters<typeof api.users.create.execute>[0]) => api.users.create.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.users.lists()],
  }
);

export const useUpdateUser = createMutationHook(
  (data: { id: number; updates: Parameters<typeof api.users.update.execute>[1] }) => 
    api.users.update.execute(data.id, data.updates),
  {
    onSuccessInvalidate: (_, variables) => [
      queryKeys.users.lists(),
      queryKeys.users.detail(variables.id),
    ],
  }
);

export const useDeleteUser = createMutationHook(
  (id: number) => api.users.delete.execute(id),
  {
    onSuccessInvalidate: (_, id) => [
      queryKeys.users.lists(),
      queryKeys.users.detail(id),
    ],
  }
);

// Department Hooks
export const useDepartments = createQueryHook(
  queryKeys.departments.list,
  (params?: PaginationParams) => api.departments.list.execute(params)
);

export const useDepartment = createQueryHook(
  queryKeys.departments.detail,
  (id: number) => api.departments.read.execute(id)
);

export const useCreateDepartment = createMutationHook(
  (data: Parameters<typeof api.departments.create.execute>[0]) => api.departments.create.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.departments.lists()],
  }
);

export const useUpdateDepartment = createMutationHook(
  (data: { id: number; updates: Parameters<typeof api.departments.update.execute>[1] }) => 
    api.departments.update.execute(data.id, data.updates),
  {
    onSuccessInvalidate: (_, variables) => [
      queryKeys.departments.lists(),
      queryKeys.departments.detail(variables.id),
    ],
  }
);

export const useDeleteDepartment = createMutationHook(
  (id: number) => api.departments.delete.execute(id),
  {
    onSuccessInvalidate: (_, id) => [
      queryKeys.departments.lists(),
      queryKeys.departments.detail(id),
    ],
  }
);

// Team Hooks
export const useTeams = createQueryHook(
  queryKeys.teams.list,
  (params?: PaginationParams) => api.teams.list.execute(params)
);

export const useTeam = createQueryHook(
  queryKeys.teams.detail,
  (id: number) => api.teams.read.execute(id)
);

export const useCreateTeam = createMutationHook(
  (data: Parameters<typeof api.teams.create.execute>[0]) => api.teams.create.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.teams.lists()],
  }
);

export const useUpdateTeam = createMutationHook(
  (data: { id: number; updates: Parameters<typeof api.teams.update.execute>[1] }) => 
    api.teams.update.execute(data.id, data.updates),
  {
    onSuccessInvalidate: (_, variables) => [
      queryKeys.teams.lists(),
      queryKeys.teams.detail(variables.id),
    ],
  }
);

export const useDeleteTeam = createMutationHook(
  (id: number) => api.teams.delete.execute(id),
  {
    onSuccessInvalidate: (_, id) => [
      queryKeys.teams.lists(),
      queryKeys.teams.detail(id),
    ],
  }
);

// Goal Hooks
export const useGoals = createQueryHook(
  queryKeys.goals.list,
  (params?: PaginationParams & GoalFilter) => api.goals.list.execute(params)
);

export const useGoal = createQueryHook(
  queryKeys.goals.detail,
  (id: number) => api.goals.read.execute(id)
);

export const useCreateGoal = createMutationHook(
  (data: Parameters<typeof api.goals.create.execute>[0]) => api.goals.create.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.goals.lists()],
  }
);

export const useUpdateGoal = createMutationHook(
  (data: { id: number; updates: Parameters<typeof api.goals.update.execute>[1] }) => 
    api.goals.update.execute(data.id, data.updates),
  {
    onSuccessInvalidate: (_, variables) => [
      queryKeys.goals.lists(),
      queryKeys.goals.detail(variables.id),
    ],
  }
);

export const useDeleteGoal = createMutationHook(
  (id: number) => api.goals.delete.execute(id),
  {
    onSuccessInvalidate: (_, id) => [
      queryKeys.goals.lists(),
      queryKeys.goals.detail(id),
    ],
  }
);

// Meeting Hooks
export const useMeetings = createQueryHook(
  queryKeys.meetings.list,
  (params?: PaginationParams & MeetingFilter) => api.meetings.list.execute(params)
);

export const useMeeting = createQueryHook(
  queryKeys.meetings.detail,
  (id: number) => api.meetings.read.execute(id)
);

export const useCreateMeeting = createMutationHook(
  (data: Parameters<typeof api.meetings.create.execute>[0]) => api.meetings.create.execute(data),
  {
    onSuccessInvalidate: () => [queryKeys.meetings.lists()],
  }
);

export const useUpdateMeeting = createMutationHook(
  (data: { id: number; updates: Parameters<typeof api.meetings.update.execute>[1] }) => 
    api.meetings.update.execute(data.id, data.updates),
  {
    onSuccessInvalidate: (_, variables) => [
      queryKeys.meetings.lists(),
      queryKeys.meetings.detail(variables.id),
    ],
  }
);

export const useDeleteMeeting = createMutationHook(
  (id: number) => api.meetings.delete.execute(id),
  {
    onSuccessInvalidate: (_, id) => [
      queryKeys.meetings.lists(),
      queryKeys.meetings.detail(id),
    ],
  }
);

// Permission Hooks
export const usePermissionCheck = createQueryHook(
  queryKeys.permissions.check,
  (request: PermissionCheckRequest) => api.permissions.check.execute(request)
);

export const useRolePermissions = createQueryHook(
  queryKeys.permissions.role,
  (role: string) => api.permissions.listRolePermissions.execute(role).then(res => res.permissions)
);

// Analytics Hooks
export const useDashboardStats = createQueryHook(
  queryKeys.analytics.dashboard,
  () => api.analytics.dashboardStats.execute().then(res => res.stats)
);

export const useTeamMetrics = createQueryHook(
  queryKeys.analytics.team,
  (teamId?: number) => api.analytics.teamMetrics.execute(teamId).then(res => res.metrics)
);

export const useDepartmentMetrics = createQueryHook(
  queryKeys.analytics.department,
  (departmentId?: number) => api.analytics.departmentMetrics.execute(departmentId).then(res => res.metrics)
);

// Utility hooks for common patterns
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAuth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
    invalidateDepartments: () => queryClient.invalidateQueries({ queryKey: queryKeys.departments.all }),
    invalidateTeams: () => queryClient.invalidateQueries({ queryKey: queryKeys.teams.all }),
    invalidateGoals: () => queryClient.invalidateQueries({ queryKey: queryKeys.goals.all }),
    invalidateMeetings: () => queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all }),
    invalidateReviews: () => queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all }),
    invalidateSurveys: () => queryClient.invalidateQueries({ queryKey: queryKeys.surveys.all }),
    invalidateAnalytics: () => queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all }),
    invalidatePermissions: () => queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
};

// Optimistic update utilities
export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();
  
  return {
    updateUser: (userId: number, updates: Partial<User>) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), (oldData: any) => ({
        ...oldData,
        ...updates,
      }));
    },
    
    updateGoal: (goalId: number, updates: Partial<Goal>) => {
      queryClient.setQueryData(queryKeys.goals.detail(goalId), (oldData: any) => ({
        ...oldData,
        ...updates,
      }));
    },
    
    updateGoalProgress: (goalId: number, progress: number) => {
      queryClient.setQueryData(queryKeys.goals.detail(goalId), (oldData: any) => ({
        ...oldData,
        progress,
      }));
    },
  };
};

// Prefetching utilities
export const usePrefetch = () => {
  const queryClient = useQueryClient();
  
  return {
    prefetchUser: (userId: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.users.detail(userId),
        queryFn: () => api.users.read.execute(userId),
        staleTime: 10 * 1000, // 10 seconds
      });
    },
    
    prefetchGoal: (goalId: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.goals.detail(goalId),
        queryFn: () => api.goals.read.execute(goalId),
        staleTime: 10 * 1000, // 10 seconds
      });
    },
  };
};