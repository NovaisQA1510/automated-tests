// playwright/helpers/employee-form.js
//
// Seletores baseados em inspeção real do DOM (DevTools), não mais em
// suposição. Origem: prints do formulário "Adicionar Funcionário" e da
// listagem de Funcionário(s).
//
// Padrão confirmado: cada campo do formulário tem um atributo `name`
// estável (name="name", "cpf", "rg", "birthDay", "caNumber"), muito mais
// resiliente do que as classes hash (ex.: c-jzRMpM, compartilhada por
// TODOS os inputs do formulário).
//
// Confirmação de cadastro: a aplicação renderiza o funcionário salvo em
// <div class="c-bXqUbA"><span>{nome}</span></div>. Confirmado em múltiplas
// capturas de tela após salvar, por isso é o seletor oficial de
// verificação pós-cadastro.

const BASE_URL = process.env.BASE_URL || 'http://analista-teste.seatecnologia.com.br/';

async function visitarPaginaInicial(page) {
  await page.goto(BASE_URL);
}

async function abrirFormularioDeCadastro(page) {
  await visitarPaginaInicial(page);
  await page.locator('button.c-kUQtTK', { hasText: 'Adicionar Funcionário' }).click();
  // Aguarda o formulário estar completamente aberto e interativo
  await page.locator('input[name="name"]').waitFor({ state: 'visible' });
}

async function preencherDadosBasicos(page, { nome, sexo = 'Masculino', cpf, dataNascimentoISO, rg, cargo } = {}) {
  if (nome) {
    await page.locator('input[name="name"]').fill(nome);
  }
  if (sexo) {
    // Grupo de radio "Masculino" / "Feminino" — seleciona pelo texto
    // visível, mais estável do que adivinhar o atributo `name` do radio.
    await page.getByText(sexo, { exact: false }).first().click();
  }
  if (cpf) {
    await page.locator('input[name="cpf"]').fill(cpf);
  }
  if (dataNascimentoISO) {
    await page.locator('input[name="birthDay"]').fill(dataNascimentoISO);
  }
  if (rg) {
    await page.locator('input[name="rg"]').fill(rg);
  }
  if (cargo) {
    const campo = page.locator('[name="cargo"]');
    const tagName = await campo.evaluate(el => el.tagName.toLowerCase()).catch(() => null);
    if (tagName === 'select') {
      await campo.selectOption({ label: cargo });
    } else if (tagName) {
      await campo.fill(cargo);
    } else {
      // Fallback: localiza pelo label "Cargo" caso o name real seja diferente
      await page.getByLabel(/^cargo$/i).fill(cargo);
    }
  }
}

async function adicionarEpiNaAtividadeCorrente(page, { numeroCA } = {}) {
  // As atividades/EPI já vêm com uma opção padrão pré-selecionada
  // ("Ativid 01" / "Capacete de segurança"), então não é necessário
  // selecionar manualmente — apenas informar o número do CA e confirmar.
  if (numeroCA) {
    await page.locator('input[name="caNumber"]').fill(numeroCA);
  }
  // "Adicionar EPI" NÃO é um <button>, é um <span class="addEPI">.
  await page.locator('span.addEPI').click();
}

async function adicionarOutraAtividade(page) {
  await page.getByRole('button', { name: 'Adicionar outra atividade' }).click();
}

async function salvarFormulario(page) {
  const btn = page.locator('button.save[type="submit"]');
  await btn.click();
  // Aguarda o formulário fechar (botão sai do DOM) — indica que o save foi processado
  await btn.waitFor({ state: 'detached', timeout: 5000 }).catch(() => page.waitForLoadState('networkidle'));
}

function funcionarioNaLista(page, nome) {
  return page.getByText(nome, { exact: true });
}

module.exports = {
  BASE_URL,
  visitarPaginaInicial,
  abrirFormularioDeCadastro,
  preencherDadosBasicos,
  adicionarEpiNaAtividadeCorrente,
  adicionarOutraAtividade,
  salvarFormulario,
  funcionarioNaLista,
};
