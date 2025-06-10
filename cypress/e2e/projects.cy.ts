describe('Project Management', () => {
  beforeEach(() => {
    cy.visit('/projects')
  })

  it('should display projects page', () => {
    cy.contains('Projetos').should('be.visible')
    cy.get('button').contains('NOVO PROJETO').should('be.visible')
  })

  it('should create a new project', () => {
    cy.get('button').contains('NOVO PROJETO').click()
    
    // Fill project form
    cy.get('input[name="name"]').type('Website Corporativo')
    cy.get('input[name="client"]').type('Empresa ABC')
    cy.get('textarea[name="description"]').type('Desenvolvimento de website institucional')
    
    // Select duration
    cy.get('select[name="estimatedDays"]').select('65')
    
    // Create project
    cy.get('button').contains('Criar Projeto').click()
    
    // Verify project was created
    cy.contains('Website Corporativo').should('be.visible')
    cy.contains('Empresa ABC').should('be.visible')
  })

  it('should switch between board views', () => {
    // Test boards view
    cy.get('button[title="Boards"]').click()
    cy.get('.board-column').should('be.visible')
    
    // Test list view
    cy.get('button[title="List"]').click()
    cy.get('table, .project-list').should('be.visible')
    
    // Test calendar view
    cy.get('button[title="Calendar"]').click()
    cy.contains('Calendário').should('be.visible')
  })

  it('should open project details', () => {
    // Assuming there's at least one project
    cy.get('.project-card').first().click()
    cy.get('button').contains('Ver Detalhes').click()
    
    // Verify detail view
    cy.contains('Tarefas do Projeto').should('be.visible')
    cy.get('.task-item').should('exist')
  })

  it('should drag and drop projects between columns', () => {
    // Test drag and drop functionality
    cy.get('.project-card').first().as('projectCard')
    cy.get('.board-column').contains('Em Progresso').as('targetColumn')
    
    cy.get('@projectCard').trigger('dragstart')
    cy.get('@targetColumn').trigger('drop')
    
    // Verify project moved
    cy.get('@targetColumn').should('contain', 'projeto')
  })

  it('should filter projects by search', () => {
    cy.get('input[placeholder*="Buscar"]').type('Website')
    
    // Verify filtered results
    cy.get('.project-card').should('contain', 'Website')
  })
})