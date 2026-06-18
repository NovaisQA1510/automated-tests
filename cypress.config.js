// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://analista-teste.seatecnologia.com.br/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    video: true,            // grava evidência de execução em vídeo
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
  },
  env: {
    BASE_URL: 'http://analista-teste.seatecnologia.com.br/',
  },
});
