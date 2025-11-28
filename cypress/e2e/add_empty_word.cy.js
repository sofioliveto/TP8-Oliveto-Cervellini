describe('Validación de palabra vacía', () => {
  it('No agrega palabra si el input está vacío', () => {
    cy.visit('/'); // Usa baseUrl del config

    // Esperar a que el contenedor de palabras exista y un pequeño buffer antes de contar
    cy.get('#listaPalabras', { timeout: 10000 }).should('exist');
    cy.wait(1000); // <-- tiempo de espera agregado

    // Contar cuántas palabras hay antes (puede ser 0 si no hay palabras)
    cy.get('#listaPalabras').then(($container) => {
      const cantidadAntes = $container.find('div.palabra-item').length;

      // Simular clic sin escribir nada
      cy.get('#palabraInput').clear(); // Asegura que esté vacío
      cy.get('div.form-group button').click();

      // Verificar que la cantidad de palabras no cambió
      cy.get('#listaPalabras').find('div.palabra-item').should('have.length', cantidadAntes);
    });
  });
});
