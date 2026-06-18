// playwright/tests/cadastro-funcionario.spec.js
//
// Funcionalidade automatizada 1/2: Cadastro de Funcionário + Validação do
// Cadastro
//
// Cenários:
//  1) Cadastro completo válido (Nome, Sexo, CPF, Data, RG, Cargo, EPI) e
//     confirmação de que o registro aparece na listagem (div.c-bXqUbA).
//  2) Validação de CPF — a aplicação aceita CPF com 11 caracteres não
//     numéricos e CPF com todos os dígitos iguais. O campo tem
//     minlength/maxlength=11 (validação nativa de TAMANHO), mas nenhuma
//     validação de FORMATO/dígito verificador. Os testes abaixo usam
//     exatamente 11 caracteres para passar pela validação nativa do
//     navegador e expor a ausência de validação de formato pela aplicação
//     (referência: BUG-08). Eles documentam o comportamento ESPERADO pelo
//     requisito e devem FALHAR no build atual.

const { test, expect } = require('@playwright/test');
const {
  visitarPaginaInicial,
  abrirFormularioDeCadastro,
  preencherDadosBasicos,
  adicionarEpiNaAtividadeCorrente,
  salvarFormulario,
  funcionarioNaLista,
} = require('../helpers/employee-form');

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

test.describe('Cadastro de Funcionário', () => {
  test('deve cadastrar um funcionário válido e exibi-lo na listagem', async ({ page }) => {
    // Navega para a lista e lê o total antes de abrir o formulário
    await visitarPaginaInicial(page);
    const textoAntes = await page.getByText(/Ativos \d+\/\d+/).textContent();
    const totalAntes = parseInt(textoAntes.match(/\/(\d+)/)[1]);

    // Abre o formulário uma única vez
    await abrirFormularioDeCadastro(page);
    const nome = `QA Automatizado Cadastro ${Date.now()}`;

    await preencherDadosBasicos(page, {
      nome,
      cpf: gerarCPF(),
      dataNascimentoISO: '1990-01-01',
      rg: '123456789',
    });

    await adicionarEpiNaAtividadeCorrente(page, { numeroCA: '12345' });
    await salvarFormulario(page);

    // Após o save o servidor retorna 201 mas o cliente não refaz o GET da lista automaticamente.
    // Navegar de volta força um reload com dados atualizados do servidor.
    await visitarPaginaInicial(page);

    // Verifica pelo nome (assertion principal): o funcionário deve aparecer na listagem.
    await expect(funcionarioNaLista(page, nome)).toBeVisible();

    // Verifica que o contador aumentou pelo menos 1 (pode subir mais se outros browsers
    // rodarem em paralelo e cadastrarem funcionários simultaneamente).
    const textoDepois = await page.getByText(/Ativos \d+\/\d+/).textContent();
    const totalDepois = parseInt(textoDepois.match(/\/(\d+)/)[1]);
    expect(totalDepois).toBeGreaterThanOrEqual(totalAntes + 1);
  });

  test('não deve aceitar CPF com 11 caracteres não numéricos [referência: BUG-08]', async ({ page }) => {
    await abrirFormularioDeCadastro(page);
    const nome = `QA Automatizado CPF Inválido ${Date.now()}`;
    await preencherDadosBasicos(page, { nome, cpf: 'adasdasdsad' });
    await salvarFormulario(page);

    await expect(funcionarioNaLista(page, nome)).toHaveCount(0);
  });

  test('não deve aceitar CPF com todos os dígitos iguais [referência: BUG-08]', async ({ page }) => {
    await abrirFormularioDeCadastro(page);
    const nome = `QA Automatizado CPF Repetido ${Date.now()}`;
    await preencherDadosBasicos(page, { nome, cpf: '11111111111' });
    await salvarFormulario(page);

    await expect(funcionarioNaLista(page, nome)).toHaveCount(0);
  });
});
