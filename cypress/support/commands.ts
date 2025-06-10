/// <reference types="cypress" />

// Login command
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button').contains('Entrar').click()
  cy.url().should('include', '/')
})

// Create project command
Cypress.Commands.add('createProject', (name: string, client: string) => {
  cy.visit('/projects')
  cy.get('button').contains('NOVO PROJETO').click()
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="client"]').type(client)
  cy.get('button').contains('Criar Projeto').click()
  cy.contains(name).should('be.visible')
})

// Add financial entry command
Cypress.Commands.add('addFinancialEntry', (type: 'receita' | 'despesa', amount: number) => {
  cy.visit('/finance')
  cy.get('button').contains(type === 'receita' ? 'Nova Receita' : 'Nova Despesa').click()
  cy.get('input[name="amount"]').type(amount.toString())
  cy.get('input[name="description"]').type(`Test ${type} entry`)
  cy.get('button').contains('Salvar').click()
  cy.contains(amount.toString()).should('be.visible')
})

// Import OFX command
Cypress.Commands.add('importOfx', (filename: string) => {
  cy.visit('/finance')
  cy.get('button').contains('Importar OFX').click()
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filename}`)
  cy.get('button').contains('Importar').click()
  cy.get('table').should('contain', 'R$')
})