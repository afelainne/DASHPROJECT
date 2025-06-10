describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display dashboard with key metrics', () => {
    cy.contains('DesignFlow Pro').should('be.visible')
    cy.get('.stats-card').should('have.length.at.least', 3)
  })

  it('should display quick actions', () => {
    cy.get('button').contains('Novo Projeto').should('be.visible')
    cy.get('button').contains('Nova Tarefa').should('be.visible')
    cy.get('button').contains('Lançamento').should('be.visible')
    cy.get('button').contains('Relatório').should('be.visible')
  })

  it('should navigate from quick actions', () => {
    // Test project creation from dashboard
    cy.get('button').contains('Novo Projeto').click()
    cy.url().should('include', '/projects')
    cy.get('input[name="name"]').should('be.visible')
    
    // Go back to dashboard
    cy.visit('/')
    
    // Test financial entry from dashboard
    cy.get('button').contains('Lançamento').click()
    cy.get('input[name="amount"]').should('be.visible')
    
    // Go back to dashboard
    cy.visit('/')
    
    // Test reports navigation
    cy.get('button').contains('Relatório').click()
    cy.url().should('include', '/reports')
  })

  it('should display project preview cards', () => {
    cy.get('.project-preview').should('exist')
    cy.contains('projetos ativos').should('be.visible')
  })

  it('should display financial chart preview', () => {
    cy.get('.financial-chart').should('exist')
    cy.contains('Fluxo').should('be.visible')
  })

  it('should be responsive', () => {
    // Test mobile view
    cy.viewport(375, 667)
    cy.get('.stats-card').should('be.visible')
    cy.get('button').contains('Novo Projeto').should('be.visible')
    
    // Test tablet view
    cy.viewport(768, 1024)
    cy.get('.stats-card').should('be.visible')
    
    // Test desktop view
    cy.viewport(1280, 720)
    cy.get('.stats-card').should('be.visible')
  })
})