describe('Financial Management', () => {
  beforeEach(() => {
    cy.visit('/finance')
  })

  it('should display financial dashboard', () => {
    cy.contains('Financeiro').should('be.visible')
    cy.get('.swiss-card').should('have.length.at.least', 1)
  })

  it('should add new revenue entry', () => {
    cy.get('button').contains('Nova Receita').click()
    
    // Fill revenue form
    cy.get('input[name="amount"]').type('5000')
    cy.get('input[name="description"]').type('Pagamento Website')
    cy.get('select[name="category"]').select(0) // Select first category
    
    // Save entry
    cy.get('button').contains('Salvar').click()
    
    // Verify entry was added
    cy.contains('R$ 5.000').should('be.visible')
    cy.contains('Pagamento Website').should('be.visible')
  })

  it('should add new expense entry', () => {
    cy.get('button').contains('Nova Despesa').click()
    
    // Fill expense form
    cy.get('input[name="amount"]').type('1200')
    cy.get('input[name="description"]').type('Adobe Creative Suite')
    cy.get('select[name="category"]').select(0) // Select first category
    
    // Save entry
    cy.get('button').contains('Salvar').click()
    
    // Verify entry was added
    cy.contains('R$ 1.200').should('be.visible')
    cy.contains('Adobe Creative Suite').should('be.visible')
  })

  it('should manage categories', () => {
    cy.get('button').contains('Nova Receita').click()
    cy.get('button').contains('Gerenciar').click()
    
    // Add new category
    cy.get('input[placeholder*="categoria"]').type('Consultoria')
    cy.get('button').contains('Adicionar').click()
    
    // Verify category was added
    cy.contains('Consultoria').should('be.visible')
    
    // Remove category
    cy.contains('Consultoria').parent().find('button').contains('Remover').click()
    cy.contains('Consultoria').should('not.exist')
  })

  it('should import OFX file', () => {
    cy.get('button').contains('Importar OFX').click()
    
    // Upload OFX file (mock)
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.ofx', { force: true })
    cy.get('button').contains('Importar').click()
    
    // Verify OFX entries table
    cy.get('table').should('be.visible')
    cy.get('table tbody tr').should('have.length.at.least', 1)
  })

  it('should link OFX entry to fixed expense', () => {
    // First import OFX
    cy.importOfx('sample.ofx')
    
    // Link first entry
    cy.get('table tbody tr').first().find('button').contains('Vincular Fixo').click()
    
    // Select category and save
    cy.get('select').select(0)
    cy.get('button').contains('Salvar').click()
    
    // Verify entry is linked
    cy.get('table tbody tr').first().should('contain', 'Vinculado')
  })

  it('should display financial charts', () => {
    cy.visit('/reports')
    
    // Verify charts are rendered
    cy.get('.recharts-wrapper').should('have.length.at.least', 1)
    cy.contains('Fluxo de Caixa').should('be.visible')
    cy.contains('DRE').should('be.visible')
  })

  it('should export financial reports', () => {
    cy.visit('/reports')
    
    // Test export buttons
    cy.get('button').contains('Exportar Fluxo').click()
    cy.get('button').contains('Exportar DRE').click()
    
    // Verify download actions (would trigger downloads in real browser)
  })
})