import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../utils/test-utils'
import { PermissionGuard } from '@/features/auth/components/permission-guard'

// Mock the contexts
const mockHasPermission = vi.fn()
const mockCheckPermission = vi.fn()
const mockIsAuthenticated = vi.fn()

vi.mock('@/contexts/permissions-context', () => ({
  usePermissions: () => ({
    hasPermission: mockHasPermission,
    checkPermission: mockCheckPermission,
    isLoading: false,
  }),
}))

vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated(),
  }),
}))

describe('PermissionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.mockReturnValue(true)
  })

  it('renders children when user has permission', () => {
    mockHasPermission.mockReturnValue(true)
    
    render(
      <PermissionGuard resource="users" action="read">
        <div>Protected content</div>
      </PermissionGuard>
    )
    
    expect(screen.getByText('Protected content')).toBeInTheDocument()
    expect(mockHasPermission).toHaveBeenCalledWith('users', 'read')
  })

  it('does not render children when user lacks permission', () => {
    mockHasPermission.mockReturnValue(false)
    
    render(
      <PermissionGuard resource="users" action="delete">
        <div>Protected content</div>
      </PermissionGuard>
    )
    
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders fallback when user lacks permission and fallback is provided', () => {
    mockHasPermission.mockReturnValue(false)
    
    render(
      <PermissionGuard 
        resource="users" 
        action="delete"
        fallback={<div>Access denied</div>}
      >
        <div>Protected content</div>
      </PermissionGuard>
    )
    
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    expect(screen.getByText('Access denied')).toBeInTheDocument()
  })

  it('does not render anything when user is not authenticated', () => {
    mockIsAuthenticated.mockReturnValue(false)
    mockHasPermission.mockReturnValue(true)
    
    render(
      <PermissionGuard resource="users" action="read">
        <div>Protected content</div>
      </PermissionGuard>
    )
    
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('performs server-side check when serverCheck is true', async () => {
    mockHasPermission.mockReturnValue(true)
    mockCheckPermission.mockResolvedValue(true)
    
    render(
      <PermissionGuard resource="users" action="read" serverCheck>
        <div>Protected content</div>
      </PermissionGuard>
    )
    
    expect(mockCheckPermission).toHaveBeenCalledWith('users', 'read')
  })

  it('handles server check failure gracefully', async () => {
    mockHasPermission.mockReturnValue(true)
    mockCheckPermission.mockRejectedValue(new Error('Server error'))
    
    render(
      <PermissionGuard 
        resource="users" 
        action="read" 
        serverCheck
        fallback={<div>Server error</div>}
      >
        <div>Protected content</div>
      </PermissionGuard>
    )
    
    // Should show fallback when server check fails
    expect(mockCheckPermission).toHaveBeenCalledWith('users', 'read')
  })

  it('works with different resource and action combinations', () => {
    mockHasPermission.mockReturnValue(true)
    
    const testCases = [
      { resource: 'dashboard', action: 'view' },
      { resource: 'reports', action: 'generate' },
      { resource: 'settings', action: 'modify' },
    ]
    
    testCases.forEach(({ resource, action }) => {
      render(
        <PermissionGuard resource={resource} action={action}>
          <div>{`${resource}-${action} content`}</div>
        </PermissionGuard>
      )
      
      expect(mockHasPermission).toHaveBeenCalledWith(resource, action)
      expect(screen.getByText(`${resource}-${action} content`)).toBeInTheDocument()
    })
  })
})