describe('Teste de Login com erro - Easytime', () => {
  it('Deve exibir mensagem de erro ao tentar logar com credenciais inválidas', () => {
    cy.visit('http://localhost:4200/login');

    cy.get('input[name="login"]').type('vivisantos');
    cy.get('input[name="senha"]').type('vivi@123');
 
    cy.contains('Entrar').click();

    cy.url().should('not.include', '/bater-ponto');

    cy.contains('Login ou senha inválidos. Verifique suas credenciais.').should('be.visible');
  });
});