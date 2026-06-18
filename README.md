# Desafio QA — SEA Tecnologia | Automação E2E com Cypress e Playwright

Suíte de testes automatizados desenvolvida como entrega do **Desafio Analista de Teste — SEA Tecnologia**.

O objetivo foi automatizar dois fluxos críticos de uma aplicação web de gestão de funcionários usando **Cypress** e **Playwright** simultaneamente — com a mesma cobertura funcional nas duas ferramentas — demonstrando domínio de ambos os frameworks de automação.

---

## Sobre o Desafio

A aplicação alvo é um sistema de gestão de funcionários disponível em:

> `http://analista-teste.seatecnologia.com.br/`

Foram automatizadas **2 funcionalidades** com **9 cenários de teste** no total, implementados em paralelo nos dois frameworks:

| # | Funcionalidade | Cenários | Cypress | Playwright |
|---|---|:---:|---|---|
| 1 | Cadastro de Funcionário + validação na listagem | 3 | `cypress/e2e/cadastro-funcionario.cy.js` | `playwright/tests/cadastro-funcionario.spec.js` |
| 2 | Validação de Elementos da Página Inicial | 6 | `cypress/e2e/pagina-inicial.cy.js` | `playwright/tests/pagina-inicial.spec.js` |

---

## Cenários Automatizados

### Funcionalidade 1 — Cadastro de Funcionário

| # | Cenário | Resultado Esperado |
|---|---|---|
| 1 | Cadastro completo com dados válidos | Funcionário aparece na listagem e contador `Ativos X/Y` incrementa |
| 2 | CPF com 11 caracteres não numéricos `[BUG-08]` | Sistema deve rejeitar — **falha intencionalmente** para expor o bug |
| 3 | CPF com todos os dígitos iguais `[BUG-08]` | Sistema deve rejeitar — **falha intencionalmente** para expor o bug |

> Os testes de CPF inválido documentam o **comportamento esperado pelo requisito**, não o estado atual da aplicação. Quando o BUG-08 for corrigido, eles passarão automaticamente sem nenhuma alteração no código de teste.

### Funcionalidade 2 — Página Inicial (Smoke Test)

| # | Cenário |
|---|---|
| 1 | Exibe os 6 itens do carrossel superior |
| 2 | Exibe o texto descritivo no painel esquerdo |
| 3 | Exibe o cabeçalho `Funcionário(s)` |
| 4 | Exibe o botão `+ Adicionar Funcionário` visível e habilitado |
| 5 | Exibe os botões de filtro `Ver apenas ativos` e `Limpar filtros` |
| 6 | Exibe o contador no formato `Ativos X/Y` |

---

## Estrutura do Projeto

```
automated-tests/
├── cypress/
│   ├── e2e/
│   │   ├── pagina-inicial.cy.js
│   │   └── cadastro-funcionario.cy.js
│   ├── support/
│   │   └── employee-form.helpers.js   # Page Actions reutilizáveis (Cypress)
│   └── videos/                        # evidências em vídeo (geradas na execução)
├── playwright/
│   ├── tests/
│   │   ├── pagina-inicial.spec.js
│   │   └── cadastro-funcionario.spec.js
│   └── helpers/
│       └── employee-form.js           # Page Actions reutilizáveis (Playwright)
├── playwright-report/                 # relatório HTML (gerado na execução)
├── test-results/                      # screenshots/vídeos de falhas (Playwright)
├── cypress.config.js
├── playwright.config.js
└── package.json
```

---

## Seletores Utilizados

Todos os seletores foram confirmados por inspeção direta do DOM via DevTools:

| Elemento | Seletor | Observação |
|---|---|---|
| Campo Nome | `input[name="name"]` | atributo `required` nativo |
| Campo CPF | `input[name="cpf"]` | `minlength="11" maxlength="11"` — apenas tamanho |
| Campo RG | `input[name="rg"]` | atributo `required` nativo |
| Campo Data de Nascimento | `input[name="birthDay"]` | `type="date"`, valor em ISO `aaaa-mm-dd` |
| Campo Número do CA (EPI) | `input[name="caNumber"]` | dentro do bloco de Atividade/EPI |
| Botão Adicionar Funcionário | `button.c-kUQtTK` | texto `+ Adicionar Funcionário` |
| Link Adicionar EPI | `span.addEPI` | é um `<span>`, não um `<button>` |
| Botão Salvar | `button.save[type="submit"]` | classe literal `save` (não hash) |
| Carrossel (cada item) | `div.c-geUhfZ` | 6 elementos esperados |
| Texto descritivo | `span.descriptionSpan` | classe literal, estável |
| Card do funcionário | `div.c-bXqUbA > span` | texto = nome cadastrado |

> Classes no formato `c-XXXXXX` são geradas por CSS-in-JS e tendem a ser estáveis entre execuções do mesmo build, mas podem mudar se o componente for reconstruído. Sempre que existia um atributo `name`, `id` ou classe literal disponível, ele foi priorizado.

---

## Bugs Documentados

| ID | Campo | Descrição |
|----|-------|-----------|
| BUG-08 | CPF | A aplicação valida apenas o **tamanho** do campo (11 caracteres via `minlength`/`maxlength`). Não há validação de formato nem de dígito verificador. CPFs com caracteres não numéricos e CPFs com todos os dígitos iguais são aceitos indevidamente. |

---

## Pré-requisitos

- **Node.js** 18+
- **npm** 9+

---

## Instalação

```bash
git clone git@github-pessoal:NovaisQA1510/automated-tests.git
cd automated-tests
npm install
npx playwright install   # baixa os navegadores (Chromium, Firefox, WebKit)
```

---

## Como Executar

### Cypress

```bash
# Headless (modo CI / linha de comando)
npm run test:cypress

# Interface interativa (Cypress App)
npm run test:cypress:open
```

### Playwright

```bash
# Headless nos 3 navegadores configurados
npm run test:playwright

# Abrir relatório HTML após execução
npm run test:playwright:report
```

### Apontar para outro ambiente

```bash
BASE_URL=https://outro-ambiente.example.com npm run test:playwright
```

---

## Configuração de Browsers (Playwright)

O `playwright.config.js` está configurado para rodar em 3 engines:

| Projeto | Engine |
|---|---|
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `webkit` | Desktop Safari |

---

## Evidências de Execução

| Ferramenta | Evidência | Localização |
|---|---|---|
| Cypress | Vídeo de cada spec | `cypress/videos/` |
| Cypress | Screenshot em falhas | `cypress/screenshots/` |
| Playwright | Relatório HTML | `playwright-report/index.html` |
| Playwright | Vídeo e trace (só em falha) | `test-results/` |

---

## Tecnologias

| Ferramenta | Versão |
|---|---|
| [Cypress](https://www.cypress.io/) | ^13.6.0 |
| [Playwright](https://playwright.dev/) | ^1.56.0 |
| Node.js | 18+ |

---

Desenvolvido por **Marcus Novais** — Analista de QA  
Desafio: **SEA Tecnologia**
