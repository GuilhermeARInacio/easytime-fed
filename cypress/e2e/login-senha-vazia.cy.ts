describe('Teste de Login com senha vazia', () => {
  it('Não deve permitir login com senha vazia', () => {
    cy.visit('http://localhost:4200/login');
  
    cy.get('input[name="login"]').type('usuario');
    cy.get('input[name="senha"]').should('be.empty');

    cy.contains('Entrar').click();

    // Mensagem de erro esperada apenas para o campo senha
    cy.contains('Por favor, preencha a senha').should('be.visible');
  });
})