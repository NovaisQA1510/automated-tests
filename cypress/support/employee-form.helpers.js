// cypress/support/employee-form.helpers.js
//
// Seletores baseados em inspeção real do DOM (DevTools), não mais em
// suposição. Origem: prints do formulário "Adicionar Funcionário" e da
// listagem de Funcionário(s).
//
// Padrão confirmado: cada campo do formulário tem um atributo `name`
// estável (name="name", "cpf", "rg", "birthDay", "caNumber"), o que é
// muito mais resiliente do que as classes hash (ex.: c-jzRMpM, que é
// compartilhada por TODOS os inputs e não serve como seletor único).
//
// Confirmação de cadastro: a aplicação renderiza o funcionário salvo em
// <div class="c-bXqUbA"><span>{nome}</span></div>. Essa classe foi
// confirmada em múltiplas capturas (sempre a mesma após salvar), então é
// usada como seletor oficial de verificação pós-cadastro.

const BASE_URL = Cypress.env('BASE_URL') || 'http://analista-teste.seatecnologia.com.br/';

export function visitarPaginaInicial() {
  cy.visit(BASE_URL);
}

export function abrirFormularioDeCadastro() {
  visitarPaginaInicial();
  cy.get('button.c-kUQtTK').contains('Adicionar Funcionário').click();
  // Aguarda o formulário estar completamente aberto e interativo
  cy.get('input[name="name"]').should('be.visible');
}

export function preencherDadosBasicos({ nome, sexo = 'Masculino', cpf, dataNascimentoISO, rg, cargo } = {}) {
  if (nome) {
    cy.get('input[name="name"]').clear().type(nome);
  }
  if (sexo) {
    // Grupo de radio "Masculino" / "Feminino" — seleciona pelo texto visível,
    // que é mais estável do que adivinhar o atributo `name` do radio.
    cy.contains('label, span', sexo).click();
  }
  if (cpf) {
    cy.get('input[name="cpf"]').clear().type(cpf);
  }
  if (dataNascimentoISO) {
    // input[type="date"] exige formato ISO (aaaa-mm-dd) ao usar .type()
    cy.get('input[name="birthDay"]').type(dataNascimentoISO);
  }
  if (rg) {
    cy.get('input[name="rg"]').clear().type(rg);
  }
  if (cargo) {
    cy.get('body').then($body => {
      const campo = $body.find('[name="cargo"]');
      if (campo.is('select')) {
        cy.get('[name="cargo"]').select(cargo);
      } else if (campo.length) {
        cy.get('[name="cargo"]').clear().type(cargo);
      } else {
        // Fallback: localiza pelo label "Cargo" caso o name real seja diferente
        cy.contains('label', /^cargo$/i).parent().find('input, select').type(cargo);
      }
    });
  }
}

export function adicionarEpiNaAtividadeCorrente({ numeroCA } = {}) {
  // As atividades/EPI já vêm com uma opção padrão pré-selecionada
  // ("Ativid 01" / "Capacete de segurança"), então não é necessário
  // selecionar manualmente — apenas informar o número do CA e confirmar.
  if (numeroCA) {
    cy.get('input[name="caNumber"]').clear().type(numeroCA);
  }
  // "Adicionar EPI" NÃO é um <button>, é um <span class="addEPI">.
  cy.get('span.addEPI').click();
}

export function adicionarOutraAtividade() {
  cy.contains('button', 'Adicionar outra atividade').click();
}

export function salvarFormulario() {
  cy.get('button.save[type="submit"]').click();
}

export function funcionarioApareceNaLista(nome) {
  // Busca pelo texto do nome sem depender de classes CSS geradas (hash), que mudam entre builds
  return cy.contains(nome);
}

export { BASE_URL };
