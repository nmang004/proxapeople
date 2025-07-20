import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../utils/test-utils'
import { LoginForm } from '@/features/auth/components/login-form'

// Mock the auth context
const mockLogin = vi.fn()
vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
  }),
}))

describe('LoginForm', () => {
  const user = userEvent.setup()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('updates form fields when user types', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('toggles password visibility', async () => {
    render(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole('button', { name: /toggle password/i })
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('submits form with correct data', async () => {
    const onSuccessMock = vi.fn()
    mockLogin.mockResolvedValueOnce({ success: true })
    
    render(<LoginForm onSuccess={onSuccessMock} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials'
    mockLogin.mockRejectedValueOnce(new Error(errorMessage))
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('disables form during submission', async () => {
    // Mock login to never resolve to test loading state
    mockLogin.mockImplementation(() => new Promise(() => {}))
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls onSwitchToRegister when register link is clicked', async () => {
    const onSwitchToRegisterMock = vi.fn()
    
    render(<LoginForm onSwitchToRegister={onSwitchToRegisterMock} />)
    
    const registerLink = screen.getByText(/create account/i)
    await user.click(registerLink)
    
    expect(onSwitchToRegisterMock).toHaveBeenCalled()
  })

  it('calls onSwitchToForgotPassword when forgot password link is clicked', async () => {
    const onSwitchToForgotPasswordMock = vi.fn()
    
    render(<LoginForm onSwitchToForgotPassword={onSwitchToForgotPasswordMock} />)
    
    const forgotPasswordLink = screen.getByText(/forgot password/i)
    await user.click(forgotPasswordLink)
    
    expect(onSwitchToForgotPasswordMock).toHaveBeenCalled()
  })
})