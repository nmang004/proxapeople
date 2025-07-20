import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from 'wouter'

// Mock auth context for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  // Create a new QueryClient for each test to avoid cache pollution
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MockAuthProvider>
          {children}
        </MockAuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Utility functions for common test patterns
export const createMockUser = () => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  department: 'Engineering',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

export const mockApiError = (message = 'API Error', status = 500) => {
  return Promise.reject(new Error(message))
}