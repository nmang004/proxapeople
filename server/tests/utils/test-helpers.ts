import { Request, Response } from 'express';
import { vi } from 'vitest';

// Mock Express Request
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: undefined,
    ...overrides,
  } as Partial<Request>;
};

// Mock Express Response
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    redirect: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  };
  return res;
};

// Mock database transactions
export const mockTransaction = {
  commit: vi.fn(),
  rollback: vi.fn(),
};

// Test user factory
export const createTestUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  passwordHash: '$2b$10$hashedpassword',
  role: 'user',
  department: 'Engineering',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Test permission factory
export const createTestPermission = (overrides = {}) => ({
  id: '1',
  name: 'test_permission',
  description: 'Test permission',
  resource: 'test_resource',
  action: 'read',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Mock API request helper
export const mockApiCall = async <T>(
  handler: Function,
  req: Partial<Request>,
  res: Partial<Response>
): Promise<T> => {
  await handler(req, res);
  return res.json as T;
};

// JWT token helper for testing
export const createTestJWT = (payload = {}) => {
  const defaultPayload = {
    userId: '1',
    email: 'test@example.com',
    role: 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    ...payload,
  };
  
  // For testing, we'll use a simple base64 encoded token
  return Buffer.from(JSON.stringify(defaultPayload)).toString('base64');
};