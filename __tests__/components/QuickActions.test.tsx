import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QuickActions from '@/components/dashboard/quick-actions'

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('QuickActions', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders all quick action buttons', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Novo Projeto')).toBeInTheDocument()
    expect(screen.getByText('Nova Tarefa')).toBeInTheDocument()
    expect(screen.getByText('Lançamento')).toBeInTheDocument()
    expect(screen.getByText('Relatório')).toBeInTheDocument()
  })

  it('opens project modal when clicked', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    
    const newProjectButton = screen.getByText('Novo Projeto')
    fireEvent.click(newProjectButton)
    
    // Should open modal (test implementation depends on modal structure)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('opens finance modal when clicked', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    
    const financeButton = screen.getByText('Lançamento')
    fireEvent.click(financeButton)
    
    // Should open modal
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('navigates to reports when clicked', () => {
    render(<QuickActions />, { wrapper: createWrapper() })
    
    const reportsButton = screen.getByText('Relatório')
    fireEvent.click(reportsButton)
    
    expect(mockPush).toHaveBeenCalledWith('/reports')
  })
})