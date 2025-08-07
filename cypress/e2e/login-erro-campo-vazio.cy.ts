describe('Teste de Login com campos vazios', () => {
  it('Não deve logar e deve mostrar mensagem de erro ao deixar campos vazios', () => {
    cy.visit('http://localhost:4200/login');
 
    // Deixa os campos vazios e clica em ENTRAR
    cy.contains('Entrar').click();

    // Verifica que a URL não foi redirecionada
    cy.url().should('not.include', '/bater-ponto');
 
    // Verifica que aparece mensagem de erro de campo obrigatório
    cy.contains('Por favor, preencha o login').should('be.visible');
    cy.contains('Por favor, preencha a senha').should('be.visible');
  });
});