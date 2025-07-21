import { z } from 'zod';
import { apiClient } from './client';
import {
  // Schemas from shared
  insertUserSchema,
  insertDepartmentSchema,
  insertTeamSchema,
  insertGoalSchema,
  insertOneOnOneMeetingSchema,
  insertPerformanceReviewSchema,
  insertSurveySchema,
  insertSurveyResponseSchema,
  
  // API specific schemas
  paginatedResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  registerRequestSchema,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  permissionCheckRequestSchema,
  permissionCheckResponseSchema,
  paginationParamsSchema,
  userFilterSchema,
  goalFilterSchema,
  meetingFilterSchema,
  reviewFilterSchema,
  bulkUpdateSchema,
  bulkDeleteSchema,
  bulkOperationResponseSchema,

  // Types
  User,
  Department,
  Team,
  Goal,
  OneOnOneMeeting,
  PerformanceReview,
  Survey,
  SurveyResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PermissionCheckRequest,
  PermissionCheckResponse,
  PaginationParams,
  UserFilter,
  GoalFilter,
  MeetingFilter,
  ReviewFilter,
} from './types';

// Helper function to create API response schemas
function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return dataSchema; // For now, just return the data schema directly
}

// Generic endpoint builder
class EndpointBuilder {
  constructor(private basePath: string) {}

  // Build typed endpoint methods
  create<TRequest, TResponse>(
    requestSchema: z.ZodType<TRequest>,
    responseSchema: z.ZodType<TResponse>
  ) {
    return {
      execute: async (data: TRequest) => {
        const validatedData = requestSchema.parse(data);
        const response = await apiClient.post(this.basePath, validatedData, {
          validateResponse: apiResponseSchema(responseSchema),
        });
        return response.data as TResponse;
      },
    };
  }

  read<TResponse>(responseSchema: z.ZodType<TResponse>) {
    return {
      execute: async (id: number) => {
        const response = await apiClient.get(`${this.basePath}/${id}`, {
          validateResponse: apiResponseSchema(responseSchema),
        });
        return response.data;
      },
    };
  }

  list<TResponse, TFilter = {}>(
    responseSchema: z.ZodType<TResponse>,
    filterSchema?: z.ZodType<TFilter>
  ) {
    return {
      execute: async (params?: PaginationParams & TFilter) => {
        const validatedParams = params ? {
          ...paginationParamsSchema.parse(params),
          ...(filterSchema ? filterSchema.parse(params) : {}),
        } : {};

        const queryString = new URLSearchParams(
          Object.entries(validatedParams).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString();

        const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
        const response = await apiClient.get(url, {
          validateResponse: paginatedResponseSchema(responseSchema),
        });
        return response.data as TResponse;
      },
    };
  }

  update<TRequest, TResponse>(
    requestSchema: z.ZodType<TRequest>,
    responseSchema: z.ZodType<TResponse>
  ) {
    return {
      execute: async (id: number, data: Partial<TRequest>) => {
        const validatedData = data;
        const response = await apiClient.put(`${this.basePath}/${id}`, validatedData, {
          validateResponse: apiResponseSchema(responseSchema),
        });
        return response.data as TResponse;
      },
    };
  }

  patch<TRequest, TResponse>(
    requestSchema: z.ZodType<TRequest>,
    responseSchema: z.ZodType<TResponse>
  ) {
    return {
      execute: async (id: number, data: Partial<TRequest>) => {
        const validatedData = data;
        const response = await apiClient.patch(`${this.basePath}/${id}`, validatedData, {
          validateResponse: apiResponseSchema(responseSchema),
        });
        return response.data as TResponse;
      },
    };
  }

  delete() {
    return {
      execute: async (id: number) => {
        const response = await apiClient.delete(`${this.basePath}/${id}`, {
          validateResponse: apiResponseSchema(z.object({ message: z.string() })),
        });
        return response.data as { message: string };
      },
    };
  }

  bulkUpdate<TRequest>(requestSchema: z.ZodObject<any>) {
    return {
      execute: async (data: { ids: number[]; updates: Partial<TRequest> }) => {
        const validatedData = bulkUpdateSchema(requestSchema).parse(data);
        const response = await apiClient.patch(`${this.basePath}/bulk`, validatedData, {
          validateResponse: apiResponseSchema(bulkOperationResponseSchema),
        });
        return response.data as { success: boolean; count: number };
      },
    };
  }

  bulkDelete() {
    return {
      execute: async (ids: number[]) => {
        const validatedData = bulkDeleteSchema.parse({ ids });
        const response = await apiClient.delete(`${this.basePath}/bulk`, {
          body: validatedData,
          validateResponse: apiResponseSchema(bulkOperationResponseSchema),
        });
        return response.data as { success: boolean; count: number };
      },
    };
  }

  custom<TRequest, TResponse>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    requestSchema?: z.ZodType<TRequest>,
    responseSchema?: z.ZodType<TResponse>
  ) {
    return {
      execute: async (data?: TRequest) => {
        const validatedData = requestSchema ? requestSchema.parse(data) : data;
        const response = await apiClient.request(`${this.basePath}${path}`, {
          method,
          body: validatedData,
          validateResponse: responseSchema ? apiResponseSchema(responseSchema) : undefined,
        });
        return response.data as TResponse;
      },
    };
  }
}

// Authentication endpoints
export const auth = {
  login: {
    execute: async (data: LoginRequest): Promise<LoginResponse> => {
      const validatedData = loginRequestSchema.parse(data);
      const response = await apiClient.post('/auth/login', validatedData, {
        validateResponse: apiResponseSchema(loginResponseSchema),
        skipAuth: true,
      });
      return response.data as LoginResponse;
    },
  },

  register: {
    execute: async (data: RegisterRequest): Promise<LoginResponse> => {
      const validatedData = registerRequestSchema.parse(data);
      const response = await apiClient.post('/auth/register', validatedData, {
        validateResponse: apiResponseSchema(loginResponseSchema),
        skipAuth: true,
      });
      return response.data as LoginResponse;
    },
  },

  refresh: {
    execute: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
      const validatedData = refreshTokenRequestSchema.parse(data);
      const response = await apiClient.post('/auth/refresh', validatedData, {
        validateResponse: apiResponseSchema(refreshTokenResponseSchema),
        skipAuth: true,
      });
      return response.data as RefreshTokenResponse;
    },
  },

  logout: {
    execute: async (): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/logout', {}, {
        validateResponse: apiResponseSchema(z.object({ message: z.string() })),
      });
      return response.data as { message: string };
    },
  },

  me: {
    execute: async (): Promise<{ user: User }> => {
      const response = await apiClient.get('/auth/me', {
        validateResponse: apiResponseSchema(z.object({
          user: z.object({
            id: z.number(),
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
            role: z.enum(['admin', 'hr', 'manager', 'employee']),
            jobTitle: z.string(),
            department: z.string(),
            profileImage: z.string().nullable(),
            hireDate: z.string().nullable(),
          }),
        })),
      });
      return response.data as { user: User };
    },
  },

  forgotPassword: {
    execute: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
      const validatedData = forgotPasswordRequestSchema.parse(data);
      const response = await apiClient.post('/auth/forgot-password', validatedData, {
        validateResponse: apiResponseSchema(z.object({ message: z.string() })),
        skipAuth: true,
      });
      return response.data as { message: string };
    },
  },

  resetPassword: {
    execute: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
      const validatedData = resetPasswordRequestSchema.parse(data);
      const response = await apiClient.post('/auth/reset-password', validatedData, {
        validateResponse: apiResponseSchema(z.object({ message: z.string() })),
        skipAuth: true,
      });
      return response.data as { message: string };
    },
  },
};

// Resource endpoints using the builder pattern
const userBuilder = new EndpointBuilder('/users');
const departmentBuilder = new EndpointBuilder('/departments');
const teamBuilder = new EndpointBuilder('/teams');
const goalBuilder = new EndpointBuilder('/goals');
const meetingBuilder = new EndpointBuilder('/meetings');
const reviewBuilder = new EndpointBuilder('/reviews');
const surveyBuilder = new EndpointBuilder('/surveys');

// Define response schemas (simplified User type for responses)
const userResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['admin', 'hr', 'manager', 'employee']),
  jobTitle: z.string(),
  department: z.string(),
  managerId: z.number().nullable(),
  profileImage: z.string().nullable(),
  hireDate: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const departmentResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  managerId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const teamResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  departmentId: z.number().nullable(),
  managerId: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const goalResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  userId: z.number().nullable(),
  teamId: z.number().nullable(),
  departmentId: z.number().nullable(),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  progress: z.number(),
  startDate: z.string(),
  dueDate: z.string(),
  currentValue: z.string().nullable(),
  targetValue: z.string().nullable(),
  isCompanyGoal: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Export configured endpoints
export const users = {
  create: userBuilder.create(insertUserSchema, userResponseSchema),
  read: userBuilder.read(userResponseSchema),
  list: userBuilder.list(userResponseSchema, userFilterSchema),
  update: userBuilder.update(insertUserSchema, userResponseSchema),
  patch: userBuilder.patch(insertUserSchema, userResponseSchema),
  delete: userBuilder.delete(),
  bulkUpdate: userBuilder.bulkUpdate(insertUserSchema),
  bulkDelete: userBuilder.bulkDelete(),
};

export const departments = {
  create: departmentBuilder.create(insertDepartmentSchema, departmentResponseSchema),
  read: departmentBuilder.read(departmentResponseSchema),
  list: departmentBuilder.list(departmentResponseSchema),
  update: departmentBuilder.update(insertDepartmentSchema, departmentResponseSchema),
  patch: departmentBuilder.patch(insertDepartmentSchema, departmentResponseSchema),
  delete: departmentBuilder.delete(),
};

export const teams = {
  create: teamBuilder.create(insertTeamSchema, teamResponseSchema),
  read: teamBuilder.read(teamResponseSchema),
  list: teamBuilder.list(teamResponseSchema),
  update: teamBuilder.update(insertTeamSchema, teamResponseSchema),
  patch: teamBuilder.patch(insertTeamSchema, teamResponseSchema),
  delete: teamBuilder.delete(),
};

export const goals = {
  create: goalBuilder.create(insertGoalSchema, goalResponseSchema),
  read: goalBuilder.read(goalResponseSchema),
  list: goalBuilder.list(goalResponseSchema, goalFilterSchema),
  update: goalBuilder.update(insertGoalSchema, goalResponseSchema),
  patch: goalBuilder.patch(insertGoalSchema, goalResponseSchema),
  delete: goalBuilder.delete(),
  bulkUpdate: goalBuilder.bulkUpdate(insertGoalSchema),
  bulkDelete: goalBuilder.bulkDelete(),
};

export const meetings = {
  create: meetingBuilder.create(insertOneOnOneMeetingSchema, z.any()), // TODO: Define proper response schema
  read: meetingBuilder.read(z.any()),
  list: meetingBuilder.list(z.any(), meetingFilterSchema),
  update: meetingBuilder.update(insertOneOnOneMeetingSchema, z.any()),
  patch: meetingBuilder.patch(insertOneOnOneMeetingSchema, z.any()),
  delete: meetingBuilder.delete(),
};

export const reviews = {
  create: reviewBuilder.create(insertPerformanceReviewSchema, z.any()), // TODO: Define proper response schema
  read: reviewBuilder.read(z.any()),
  list: reviewBuilder.list(z.any(), reviewFilterSchema),
  update: reviewBuilder.update(insertPerformanceReviewSchema, z.any()),
  patch: reviewBuilder.patch(insertPerformanceReviewSchema, z.any()),
  delete: reviewBuilder.delete(),
};

export const surveys = {
  create: surveyBuilder.create(insertSurveySchema, z.any()), // TODO: Define proper response schema
  read: surveyBuilder.read(z.any()),
  list: surveyBuilder.list(z.any()),
  update: surveyBuilder.update(insertSurveySchema, z.any()),
  patch: surveyBuilder.patch(insertSurveySchema, z.any()),
  delete: surveyBuilder.delete(),
};

// Permission endpoints
export const permissions = {
  check: {
    execute: async (data: PermissionCheckRequest): Promise<PermissionCheckResponse> => {
      const validatedData = permissionCheckRequestSchema.parse(data);
      const response = await apiClient.post('/permissions/check', validatedData, {
        validateResponse: apiResponseSchema(permissionCheckResponseSchema),
      });
      return response.data as PermissionCheckResponse;
    },
  },

  listUserPermissions: {
    execute: async (userId?: number): Promise<{ permissions: string[] }> => {
      const url = userId ? `/permissions/user/${userId}` : '/permissions/user';
      const response = await apiClient.get(url, {
        validateResponse: apiResponseSchema(z.object({
          permissions: z.array(z.string()),
        })),
      });
      return response.data as { permissions: string[] };
    },
  },

  listRolePermissions: {
    execute: async (role: string): Promise<{ permissions: string[] }> => {
      const response = await apiClient.get(`/permissions/role/${role}`, {
        validateResponse: apiResponseSchema(z.object({
          permissions: z.array(z.string()),
        })),
      });
      return response.data as { permissions: string[] };
    },
  },
};

// Analytics endpoints
export const analytics = {
  dashboardStats: {
    execute: async (): Promise<{ stats: Record<string, unknown> }> => {
      const response = await apiClient.get('/dashboard', {
        validateResponse: apiResponseSchema(z.object({
          stats: z.record(z.unknown()),
        })),
      });
      return response.data as { stats: Record<string, unknown> };
    },
  },
  
  dashboardData: {
    execute: async (): Promise<{
      stats: Record<string, unknown>;
      upcomingReviews: unknown[];
      teamGoals: unknown[];
      upcomingOneOnOnes: unknown[];
      teamPerformance: unknown;
      teamEngagement: unknown;
    }> => {
      const response = await apiClient.get('/dashboard', {
        validateResponse: apiResponseSchema(z.object({
          stats: z.record(z.unknown()),
          upcomingReviews: z.array(z.unknown()),
          teamGoals: z.array(z.unknown()),
          upcomingOneOnOnes: z.array(z.unknown()),
          teamPerformance: z.unknown(),
          teamEngagement: z.unknown(),
        })),
      });
      return response.data as {
        stats: Record<string, unknown>;
        upcomingReviews: unknown[];
        teamGoals: unknown[];
        upcomingOneOnOnes: unknown[];
        teamPerformance: unknown;
        teamEngagement: unknown;
      };
    },
  },

  teamMetrics: {
    execute: async (teamId?: number): Promise<{ metrics: Record<string, unknown> }> => {
      const url = teamId ? `/analytics/team/${teamId}` : '/analytics/team';
      const response = await apiClient.get(url, {
        validateResponse: apiResponseSchema(z.object({
          metrics: z.record(z.unknown()),
        })),
      });
      return response.data as { metrics: Record<string, unknown> };
    },
  },

  departmentMetrics: {
    execute: async (departmentId?: number): Promise<{ metrics: Record<string, unknown> }> => {
      const url = departmentId ? `/analytics/department/${departmentId}` : '/analytics/department';
      const response = await apiClient.get(url, {
        validateResponse: apiResponseSchema(z.object({
          metrics: z.record(z.unknown()),
        })),
      });
      return response.data as { metrics: Record<string, unknown> };
    },
  },
};

// Export all endpoints as a single API object for convenience
export const api = {
  auth,
  users,
  departments,
  teams,
  goals,
  meetings,
  reviews,
  surveys,
  permissions,
  analytics,
};

export default api;