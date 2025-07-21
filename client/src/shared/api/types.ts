import { z } from 'zod';

// Re-export types from shared schema
export * from '../../../../shared/schema';

// API Response wrapper schema
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    meta: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      total: z.number().optional(),
    }).optional(),
  });

// Error response schema
export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
});

// Pagination schemas
export const paginationParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.object({
      items: z.array(itemSchema),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
      }),
    }),
  });

// Filter schemas for common entities
export const userFilterSchema = z.object({
  role: z.enum(['admin', 'hr', 'manager', 'employee']).optional(),
  department: z.string().optional(),
  managerId: z.number().optional(),
  search: z.string().optional(),
});

export const goalFilterSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  userId: z.number().optional(),
  teamId: z.number().optional(),
  departmentId: z.number().optional(),
  isCompanyGoal: z.boolean().optional(),
  search: z.string().optional(),
});

export const meetingFilterSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'canceled']).optional(),
  managerId: z.number().optional(),
  employeeId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const reviewFilterSchema = z.object({
  status: z.enum(['not_started', 'self_review', 'peer_review', 'manager_review', 'completed']).optional(),
  reviewType: z.enum(['quarterly', 'annual', 'peer', 'self']).optional(),
  employeeId: z.number().optional(),
  reviewerId: z.number().optional(),
  reviewCycleId: z.number().optional(),
});

// Authentication schemas
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginResponseSchema = z.object({
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
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  jobTitle: z.string().min(1),
  department: z.string().min(1),
  role: z.enum(['admin', 'hr', 'manager', 'employee']).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordRequestSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Permission schemas
export const permissionCheckRequestSchema = z.object({
  resource: z.string(),
  action: z.enum(['view', 'create', 'update', 'delete', 'approve', 'assign', 'admin']),
  userId: z.number().optional(), // If checking for another user
});

export const permissionCheckResponseSchema = z.object({
  hasPermission: z.boolean(),
  reason: z.string().optional(),
});

// Bulk operation schemas
export const bulkUpdateSchema = <T extends z.ZodObject<any>>(updateSchema: T) =>
  z.object({
    ids: z.array(z.number()),
    updates: updateSchema.partial(),
  });

export const bulkDeleteSchema = z.object({
  ids: z.array(z.number()),
});

export const bulkOperationResponseSchema = z.object({
  success: z.number(),
  failed: z.number(),
  errors: z.array(z.object({
    id: z.number(),
    error: z.string(),
  })).optional(),
});

// Export type inference helpers
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<z.ZodType<T>>>>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type PaginationParams = z.infer<typeof paginationParamsSchema>;
export type PaginatedResponse<T> = z.infer<ReturnType<typeof paginatedResponseSchema<z.ZodType<T>>>>;

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export type PermissionCheckRequest = z.infer<typeof permissionCheckRequestSchema>;
export type PermissionCheckResponse = z.infer<typeof permissionCheckResponseSchema>;

export type UserFilter = z.infer<typeof userFilterSchema>;
export type GoalFilter = z.infer<typeof goalFilterSchema>;
export type MeetingFilter = z.infer<typeof meetingFilterSchema>;
export type ReviewFilter = z.infer<typeof reviewFilterSchema>;

export type BulkUpdate<T> = z.infer<ReturnType<typeof bulkUpdateSchema<z.ZodObject<any>>>>;
export type BulkDelete = z.infer<typeof bulkDeleteSchema>;
export type BulkOperationResponse = z.infer<typeof bulkOperationResponseSchema>;