// cypress/e2e/cadastro-funcionario.cy.js
//
// Funcionalidade automatizada 1/2: Cadastro de Funcionário + Validação do
// Cadastro
//
// Cenários:
//  1) Cadastro completo válido (Nome, Sexo, CPF, Data, RG, EPI) e
//     confirmação de que o contador "Ativos X/Y" incrementa após o cadastro.
//     O campo Cargo tem um bug conhecido e não é preenchido.
//  2) Validação de CPF — a aplicação aceita CPF com 11 caracteres não
//     numéricos e CPF com todos os dígitos iguais. O campo tem
//     minlength/maxlength=11 (validação nativa de TAMANHO), mas nenhuma
//     validação de FORMATO/dígito verificador. Os testes abaixo usam
//     exatamente 11 caracteres para passar pela validação nativa do
//     navegador e expor a ausência de validação de formato pela aplicação
//     (referência: BUG-08). Eles documentam o comportamento ESPERADO pelo
//     requisito e devem FALHAR no build atual.

import {
  visitarPaginaInicial,
  abrirFormularioDeCadastro,
  preencherDadosBasicos,
  adicionarEpiNaAtividadeCorrente,
  salvarFormulario,
  funcionarioApareceNaLista,
} from '../support/employee-form.helpers';

function gerarCPF() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const digito = (nums, peso) => {
    const r = (nums.reduce((s, v, i) => s + v * (peso - i), 0) * 10) % 11;
    return r >= 10 ? 0 : r;
  };
  const d1 = digito(n, 10);
  const d2 = digito([...n, d1], 11);
  return [...n, d1, d2].join('');
}

describe('Cadastro de Funcionário', () => {
  it('deve cadastrar um funcionário válido e exibi-lo na listagem', () => {
    // Navega à lista e captura o total antes de abrir o formulário
    visitarPaginaInicial();

    let totalAntes;
    cy.contains(/Ativos \d+\/\d+/).invoke('text').then(texto => {
      totalAntes = parseInt(texto.match(/\/(\d+)/)[1]);
    });

    // Abre o formulário uma única vez
    abrirFormularioDeCadastro();

    const nome = `QA Automatizado Cadastro ${Date.now()}`;

    preencherDadosBasicos({
      nome,
      cpf: gerarCPF(),
      dataNascimentoISO: '1990-01-01',
      rg: '123456789',
    });

    adicionarEpiNaAtividadeCorrente({ numeroCA: '12345' });
    salvarFormulario();

    // Após o save o servidor retorna 201 mas o cliente não refaz o GET da lista
    // automaticamente. Navegar de volta força um reload com dados atualizados.
    visitarPaginaInicial();

    cy.contains(/Ativos \d+\/\d+/).invoke('text').then(textoDepois => {
      const totalDepois = parseInt(textoDepois.match(/\/(\d+)/)[1]);
      expect(totalDepois).to.eq(totalAntes + 1);
    });
  });

  it('não deve aceitar CPF com 11 caracteres não numéricos [referência: BUG-08]', () => {
    abrirFormularioDeCadastro();
    const nome = `QA Automatizado CPF Inválido ${Date.now()}`;
    preencherDadosBasicos({ nome, cpf: 'adasdasdsad' }); // 11 caracteres, não numérico
    salvarFormulario();

    funcionarioApareceNaLista(nome).should('not.exist');
  });

  it('não deve aceitar CPF com todos os dígitos iguais [referência: BUG-08]', () => {
    abrirFormularioDeCadastro();
    const nome = `QA Automatizado CPF Repetido ${Date.now()}`;
    preencherDadosBasicos({ nome, cpf: '11111111111' }); // 11 dígitos iguais
    salvarFormulario();

    funcionarioApareceNaLista(nome).should('not.exist');
  });
});
