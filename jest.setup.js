import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({ data: [], error: null })),
      insert: jest.fn(() => ({ data: [], error: null })),
      update: jest.fn(() => ({ data: [], error: null })),
      delete: jest.fn(() => ({ data: [], error: null })),
    })),
    auth: {
      getUser: jest.fn(() => ({ data: { user: null }, error: null })),
      signIn: jest.fn(() => ({ data: {}, error: null })),
      signOut: jest.fn(() => ({ error: null })),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => ({ data: { path: 'test-path' }, error: null })),
        download: jest.fn(() => ({ data: new Blob(), error: null })),
      })),
    },
  },
}))

// Mock Vercel KV
jest.mock('@/lib/kv', () => ({
  default: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
  cache: {
    setProject: jest.fn(),
    getProject: jest.fn(),
    setOfxEntries: jest.fn(),
    getOfxEntries: jest.fn(),
    setDashboard: jest.fn(),
    getDashboard: jest.fn(),
  },
}))

// Mock Sentry
jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  setContext: jest.fn(),
  setUser: jest.fn(),
  startSpan: jest.fn((options, callback) => callback()),
}))

// Setup global fetch mock
global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})