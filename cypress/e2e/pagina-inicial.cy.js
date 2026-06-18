// cypress/e2e/pagina-inicial.cy.js
//
// Funcionalidade automatizada 2/2: Validação de Elementos da Página Inicial
//
// Smoke test estrutural da tela inicial: garante que os blocos visuais
// principais estão presentes e visíveis antes de qualquer interação,
// usando os seletores confirmados por inspeção real do DOM.

import { visitarPaginaInicial } from '../support/employee-form.helpers';

describe('Página Inicial', () => {
  beforeEach(() => {
    visitarPaginaInicial();
  });

  it('deve exibir os 6 itens do carrossel superior', () => {
    cy.get('div.c-geUhfZ').should('have.length', 6);
  });

  it('deve exibir o texto descritivo (painel esquerdo)', () => {
    cy.get('span.descriptionSpan').should('be.visible').and('not.be.empty');
  });

  it('deve exibir o cabeçalho "Funcionário(s)"', () => {
    cy.contains('h2', 'Funcionário(s)').should('be.visible');
  });

  it('deve exibir o botão "+ Adicionar Funcionário" habilitado', () => {
    cy.get('button.c-kUQtTK')
      .contains('Adicionar Funcionário')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('deve exibir os botões de filtro "Ver apenas ativos" e "Limpar filtros"', () => {
    cy.contains('button', 'Ver apenas ativos').should('be.visible');
    cy.contains('button', 'Limpar filtros').should('be.visible');
  });

  it('deve exibir o contador de funcionários ativos no formato "Ativos X/Y"', () => {
    cy.contains(/Ativos\s+\d+\/\d+/).should('be.visible');
  });
});
