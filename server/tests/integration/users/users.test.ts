import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import userRoutes from '../../../src/modules/users/routes'
import { createMockRequest, createMockResponse, createTestUser, createTestJWT } from '../../utils/test-helpers'

// Mock the database/service layer
vi.mock('../../../src/modules/users/service')
vi.mock('../../../src/shared/middleware/auth', () => ({
  requirePermission: () => (req: any, res: any, next: any) => next(),
}))

const app = express()
app.use(express.json())
app.use('/api/users', userRoutes)

describe('Users API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/users', () => {
    it('should return list of users when user has permission', async () => {
      const mockUsers = [
        createTestUser({ id: '1', email: 'user1@example.com' }),
        createTestUser({ id: '2', email: 'user2@example.com' }),
      ]

      // Mock the service response
      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.getAllUsers = vi.fn().mockResolvedValue(mockUsers)

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockUsers,
      })
    })

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .get('/api/users')
        .expect(401)
    })

    it('should handle service errors gracefully', async () => {
      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.getAllUsers = vi.fn().mockRejectedValue(new Error('Database error'))

      await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .expect(500)
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return specific user by ID', async () => {
      const mockUser = createTestUser({ id: '1', email: 'user1@example.com' })

      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.getUserById = vi.fn().mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${createTestJWT({ userId: '1' })}`)
        .expect(200)

      expect(response.body).toEqual({
        success: true,
        data: mockUser,
      })
    })

    it('should return 404 for non-existent user', async () => {
      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.getUserById = vi.fn().mockResolvedValue(null)

      await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${createTestJWT({ userId: '1' })}`)
        .expect(404)
    })

    it('should allow users to access their own profile', async () => {
      const mockUser = createTestUser({ id: '1', email: 'user1@example.com' })

      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.getUserById = vi.fn().mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${createTestJWT({ userId: '1', role: 'user' })}`)
        .expect(200)

      expect(response.body.data.id).toBe('1')
    })
  })

  describe('POST /api/users', () => {
    it('should create new user with valid data', async () => {
      const newUserData = {
        email: 'newuser@example.com',
        name: 'New User',
        department: 'Engineering',
        role: 'user',
      }
      
      const createdUser = createTestUser({ ...newUserData, id: '3' })

      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.createUser = vi.fn().mockResolvedValue(createdUser)

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .send(newUserData)
        .expect(201)

      expect(response.body).toEqual({
        success: true,
        data: createdUser,
      })
    })

    it('should validate required fields', async () => {
      const invalidData = {
        name: 'User without email',
      }

      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .send(invalidData)
        .expect(400)
    })

    it('should prevent duplicate email addresses', async () => {
      const duplicateUserData = {
        email: 'existing@example.com',
        name: 'Duplicate User',
        department: 'Engineering',
        role: 'user',
      }

      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.createUser = vi.fn().mockRejectedValue(
        new Error('Email already exists')
      )

      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .send(duplicateUserData)
        .expect(409)
    })
  })

  describe('Authentication and Authorization', () => {
    it('should require valid JWT token', async () => {
      await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })

    it('should require appropriate permissions for admin actions', async () => {
      const newUserData = {
        email: 'newuser@example.com',
        name: 'New User',
        department: 'Engineering',
        role: 'user',
      }

      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'user' })}`)
        .send(newUserData)
        .expect(403)
    })
  })

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400)
    })

    it('should handle database connection errors', async () => {
      const { UserService } = await import('../../../src/modules/users/service')
      vi.mocked(UserService).prototype.getAllUsers = vi.fn().mockRejectedValue(
        new Error('Connection refused')
      )

      await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${createTestJWT({ role: 'admin' })}`)
        .expect(500)
    })
  })
})