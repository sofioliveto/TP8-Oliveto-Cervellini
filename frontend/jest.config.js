module.exports = {
  // Simula un navegador (DOM) para probar código frontend
  testEnvironment: 'jsdom',
  // Busca archivos de prueba
  testMatch: ['**/__tests__/**/*.test.js'],
  // Le dice a Jest que ejecute setup.js antes de los tests para preparar el entorno (mocks, variables globales, etc.).
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  // Mapea archivos de estilos a un mock vacío
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__tests__/styleMock.js'
  },
  verbose: true,

  // NUEVO: Cobertura de código
  collectCoverageFrom: [
    '**/*.js',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!node_modules/**',
    "!**/index.js",
    '!jest.config.js',
    '!**/cypress/**',
    '!cypress.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html', 'json', 'json-summary', 'cobertura'],
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
      outputName: 'junit.xml'
    }]
  ],
};