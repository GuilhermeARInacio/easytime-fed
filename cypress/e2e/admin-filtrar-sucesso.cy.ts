describe('Admin - Filtrar pedidos', () => {
 it('Deve filtrar pedidos por data, tipo e status com sucesso', () => {
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

   cy.get('table tbody tr').each(($row) => {
     cy.wrap($row).contains('Alteração').should('exist');
     cy.wrap($row).contains('Pendente').should('exist');
     cy.wrap($row).contains('Concluído').should('not.exist');
     cy.wrap($row).contains('Registro').should('not.exist');
   });
 });
});