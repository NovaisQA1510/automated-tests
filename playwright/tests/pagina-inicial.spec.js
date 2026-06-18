// playwright/tests/pagina-inicial.spec.js
//
// Funcionalidade automatizada 2/2: Validação de Elementos da Página Inicial
//
// Smoke test estrutural da tela inicial: garante que os blocos visuais
// principais estão presentes e visíveis antes de qualquer interação,
// usando os seletores confirmados por inspeção real do DOM.

const { test, expect } = require('@playwright/test');
const { visitarPaginaInicial } = require('../helpers/employee-form');

test.describe('Página Inicial', () => {
  test.beforeEach(async ({ page }) => {
    await visitarPaginaInicial(page);
  });

  test('deve exibir os 6 itens do carrossel superior', async ({ page }) => {
    await expect(page.locator('div.c-geUhfZ')).toHaveCount(6);
  });

  test('deve exibir o texto descritivo (painel esquerdo)', async ({ page }) => {
    const descricao = page.locator('span.descriptionSpan');
    await expect(descricao).toBeVisible();
    await expect(descricao).not.toBeEmpty();
  });

  test('deve exibir o cabeçalho "Funcionário(s)"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Funcionário(s)' })).toBeVisible();
  });

  test('deve exibir o botão "+ Adicionar Funcionário" habilitado', async ({ page }) => {
    const botao = page.locator('button.c-kUQtTK', { hasText: 'Adicionar Funcionário' });
    await expect(botao).toBeVisible();
    await expect(botao).toBeEnabled();
  });

  test('deve exibir os botões de filtro "Ver apenas ativos" e "Limpar filtros"', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Ver apenas ativos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Limpar filtros' })).toBeVisible();
  });

  test('deve exibir o contador de funcionários ativos no formato "Ativos X/Y"', async ({ page }) => {
    await expect(page.getByText(/Ativos\s+\d+\/\d+/)).toBeVisible();
  });
});
