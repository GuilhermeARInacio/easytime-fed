describe('Admin - Aprovar pedido pendente', () => {
 it('Deve filtrar pedidos e aprovar um pedido pendente com sucesso', () => {
   cy.visit('http://localhost:4200/login');
   cy.get('input[name="login"]').type('admin');
   cy.get('input[name="senha"]').type('admin@@123');
   cy.contains('Entrar').click();

   cy.url().should('include', '/bater-ponto');
   
   cy.get('.menu-lateral .menu-botao').first().click();
   cy.contains('Consultar pedidos').click();
   cy.url().should('include', '/pedidos-registro');

   cy.get('input[name="inicio"]').clear().type('2025-06-01');
   cy.get('input[name="final"]').clear().type('2025-08-05');
   cy.get('select[name="tipo"]').select('Alteração');
   cy.get('select[name="status"]').select('Pendente');

   cy.get('button').contains('Consultar').click();

   cy.get('table tbody tr').should('exist');

   cy.get('table tbody tr').first().contains('Pendente').get('.icone-cel span.material-symbols-outlined').click();

   cy.get('.modal-alteracao').should('be.visible');

   cy.get('.modal-alteracao .aceitar').click();

   cy.contains('Pedido aprovado com sucesso').should('be.visible');

   cy.get('table tbody tr').first().contains('Aprovado').should('exist');
 });
});