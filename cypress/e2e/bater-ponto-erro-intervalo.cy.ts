describe('Usuário bate ponto com erro por intervalo curto', () => {
  it('Deve logar como user e bater ponto corretamente', () => {
    cy.visit('http://localhost:4200/login');

    cy.get('input[name="login"]').type('vivisantos');
    cy.get('input[name="senha"]').type('vivi#123');
    cy.contains('Entrar').click();

    cy.url().should('include', '/bater-ponto');

    cy.contains('Registrar').click();

    cy.contains('Ponto registrado com sucesso às ').should('be.visible'); 

    cy.contains('Registrar').click();

    cy.contains('O intervalo entre os batimentos deve ser de pelo menos 2 minutos.').should('be.visible'); 
  });
});