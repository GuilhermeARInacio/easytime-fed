describe('Teste de Login com senha vazia', () => {
  it('Não deve permitir login com senha vazia', () => {
    cy.visit('http://localhost:4200/login');
  
    cy.get('input[name="login"]').should('be.empty');
    cy.get('input[name="senha"]').type('senha#123');

    cy.contains('Entrar').click();

    // Mensagem de erro esperada apenas para o campo senha
    cy.contains('Por favor, preencha o login').should('be.visible');
  });
})