describe('Cancelación de borrado', () => {
  it('No borra la palabra si el usuario cancela la confirmación', () => {
    cy.visit('/'); // Uses baseUrl from config

    // Esperar a que el contenedor de palabras exista y un pequeño buffer antes de contar
    cy.get('#listaPalabras', { timeout: 10000 }).should('exist');
    cy.wait(1000); // <-- tiempo de espera agregado

    // Agregar una palabra para asegurar que haya al menos una para probar
    cy.get('#palabraInput').type('testCancelDelete');
    cy.get('div.form-group button').click();
    cy.wait(1000); // Esperar a que se agregue

    // Espiar y forzar confirmación negativa
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false).as('confirmSpy');
    });

    // Contar cuántas palabras hay antes
    cy.get('#listaPalabras div.palabra-item', { timeout: 5000 }).then(($itemsBefore) => {
      const cantidadAntes = $itemsBefore.length;

      // Intentar borrar
      cy.get('#listaPalabras div.palabra-item:first-child .delete-btn', { timeout: 5000 }).click();

      // Verificar que se llamó a confirm
      cy.get('@confirmSpy').should('have.been.calledOnce');

      // Verificar que la cantidad de palabras no cambió
      cy.get('#listaPalabras div.palabra-item').should('have.length', cantidadAntes);
    });
  });
});
