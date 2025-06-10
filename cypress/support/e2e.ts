// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add coverage support
import '@cypress/code-coverage/support'

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Custom commands for authentication and common actions
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      createProject(name: string, client: string): Chainable<void>
      addFinancialEntry(type: 'receita' | 'despesa', amount: number): Chainable<void>
      importOfx(filename: string): Chainable<void>
    }
  }
}