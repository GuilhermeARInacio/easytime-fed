describe('Exportar pontos em PDF', () => {
  it('Deve exportar os pontos corretamente', () => {
    cy.visit('http://localhost:4200/login');

    cy.get('input[name="login"]').type('vivisantos');
    cy.get('input[name="senha"]').type('vivi#123');

    cy.contains('Entrar').click();

    cy.url().should('include', '/bater-ponto');

    cy.get('.menu-lateral .menu-botao').first().click();
    cy.contains('Consultar registros').click();

    cy.url().should('include', '/consulta');

    cy.get('input[name="inicio"]').type('2025-06-01');
    cy.get('input[name="final"]').type('2025-07-08');

    cy.get('button').contains("Consultar").click();

    cy.get('.tabela').should('exist');

    cy.contains('Exportar').click();

    cy.contains('PDF').click();

    cy.intercept('GET', '**/exportar/pdf**').as('downloadPdf');
  });
});