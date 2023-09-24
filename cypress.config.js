const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'ht6u3n',
  
  e2e: {
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
