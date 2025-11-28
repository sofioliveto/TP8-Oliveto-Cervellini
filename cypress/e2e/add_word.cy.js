   describe('Agregar palabra', () => {
   it('Agrega una palabra correctamente', () => {
     cy.visit('/') // Uses baseUrl from config
     cy.get('title').should('contain', 'Palabras') // Verifica que el título contenga 'Palabras'
     cy.get('#palabraInput').click();
     cy.get('#palabraInput').type('bauti');
     cy.get('div.form-group button').click();
   })
 })