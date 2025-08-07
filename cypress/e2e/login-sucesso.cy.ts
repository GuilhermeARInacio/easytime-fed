describe('Teste de Login com sucesso', () => {
  it('Deve logar com sucesso e redirecionar para a tela de bater ponto', () => {
    cy.visit('http://localhost:4200/login');    // url da aplicação
 
    // Preenche o formulário
    cy.get('input[name="login"]').type('vivisantos'); // ajuste conforme credencial real
    cy.get('input[name="senha"]').type('vivi#123');   // ajuste conforme credencial real
 
    // Clica no botão ENTRAR
    cy.contains('Entrar').click();
 
    // Verifica se foi redirecionado para tela de bater ponto
    cy.url().should('include', '/bater-ponto');
 
    // Valida se a tela de bater ponto realmente carregou
    cy.contains('Registre seu ponto').should('exist'); // ajuste o texto conforme o que aparece na tela
  });
});