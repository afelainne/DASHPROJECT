// Error handling utilities (Sentry disabled for now)
export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error('Error captured:', error)
  if (context) {
    console.error('Context:', context)
  }
}

// Performance monitoring
export const trackPerformance = (name: string, fn: () => Promise<any>) => {
  return async () => {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      console.log(`${name} completed in ${duration.toFixed(2)}ms`)
      return result
    } catch (error) {
      captureError(error as Error, { operation: name })
      throw error
    }
  }
}

// User context tracking
export const setUserContext = (userId: string, email?: string) => {
  console.log('User context:', { userId, email })
}

// Custom error classes
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

// API error handler
export const handleApiError = (error: any, context: string) => {
  if (error instanceof ValidationError) {
    return { error: error.message, field: error.field, status: 400 }
  }
  
  if (error instanceof AuthenticationError) {
    return { error: error.message, status: 401 }
  }
  
  if (error instanceof DatabaseError) {
    captureError(error, { context, originalError: error.originalError })
    return { error: 'Database operation failed', status: 500 }
  }
  
  captureError(error, { context })
  return { error: 'Internal server error', status: 500 }
}