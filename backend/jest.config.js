module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  
  // NUEVO: Configuración de coverage
  // Especifica los archivos para los cuales se debe recolectar coverage
  collectCoverageFrom: [
    // Incluir todos los archivos JS excepto los de tests y configuración
    '**/*.js',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!node_modules/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html', 'json', 'json-summary'],
  // Define los umbrales mínimos de coverage
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  // Para Azure DevOps
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › '
    }]
  ]
};