// Mock de fetch antes de importar app.js
global.fetch = require('jest-fetch-mock');
fetch.enableMocks();

// ✅ FIX: Mock console methods
const originalLog = console.log;
const originalError = console.error;

describe('Frontend - Gestión de Palabras', () => {
  let appFunctions;

  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
    
    // Resetear el DOM antes de cada test
    document.body.innerHTML = `
      <input id="palabraInput" value="" />
      <div id="listaPalabras"></div>
      <div id="mensaje"></div>
    `;

    // Resetear mocks
    fetch.resetMocks();
    
    // Importar funciones
    appFunctions = require('../app.js');
  });

  afterEach(() => {
    // Restaurar console methods
    console.log = originalLog;
    console.error = originalError;
  });

  describe('mostrarMensaje()', () => {
    test('debería mostrar mensaje de éxito', () => {
      const mensaje = 'Operación exitosa';
      const tipo = 'exito';

      appFunctions.mostrarMensaje(mensaje, tipo);

      const mensajeDiv = document.getElementById('mensaje');
      expect(mensajeDiv.innerHTML).toContain(mensaje);
      expect(mensajeDiv.innerHTML).toContain('exito');
    });

    test('debería mostrar mensaje de error', () => {
      const mensaje = 'Ocurrió un error';
      const tipo = 'error';

      appFunctions.mostrarMensaje(mensaje, tipo);

      const mensajeDiv = document.getElementById('mensaje');
      expect(mensajeDiv.innerHTML).toContain(mensaje);
      expect(mensajeDiv.innerHTML).toContain('error');
    });

    test('debería limpiar el mensaje después de 3 segundos', () => {
      jest.useFakeTimers();
      appFunctions.mostrarMensaje('Hola', 'exito');
      jest.runAllTimers();
      const mensajeDiv = document.getElementById('mensaje');
      expect(mensajeDiv.innerHTML).toBe('');
    });
  });

  describe('cargarPalabras()', () => {
    test('debería cargar y mostrar palabras correctamente', async () => {
      const mockPalabras = [
        { id: 1, palabra: 'casa' },
        { id: 2, palabra: 'perro' }
      ];
      
      fetch.mockResponseOnce(JSON.stringify(mockPalabras));

      await appFunctions.cargarPalabras();

      // ✅ FIX: Actualizar URL esperada
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/palabras',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        })
      );
      const listaPalabras = document.getElementById('listaPalabras');
      expect(listaPalabras.innerHTML).toContain('casa');
      expect(listaPalabras.innerHTML).toContain('perro');
    });

    test('debería mostrar mensaje cuando no hay palabras', async () => {
      fetch.mockResponseOnce(JSON.stringify([]));

      await appFunctions.cargarPalabras();

      const listaPalabras = document.getElementById('listaPalabras');
      expect(listaPalabras.innerHTML).toContain('No hay palabras guardadas');
    });

    test('debería manejar errores de la API', async () => {
      fetch.mockReject(new Error('Network error'));

      await appFunctions.cargarPalabras();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('agregarPalabra()', () => {
    test('debería agregar una palabra exitosamente', async () => {
      const palabraInput = document.getElementById('palabraInput');
      palabraInput.value = 'gato';
      
      fetch.mockResponses(
        [JSON.stringify({ id: 3, palabra: 'gato', mensaje: 'Palabra agregada exitosamente' }), { status: 200 }],
        [JSON.stringify([{ id: 3, palabra: 'gato' }]), { status: 200 }]
      );

      await appFunctions.agregarPalabra();

      // ✅ FIX: URL y parámetros actualizados
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/palabras',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ palabra: 'gato' }),
          mode: 'cors'
        })
      );
      expect(palabraInput.value).toBe('');
    });

    test('debería validar que la palabra no esté vacía', async () => {
      const palabraInput = document.getElementById('palabraInput');
      palabraInput.value = '   ';

      await appFunctions.agregarPalabra();

      expect(fetch).not.toHaveBeenCalled();
      const mensajeDiv = document.getElementById('mensaje');
      expect(mensajeDiv.innerHTML).toContain('Por favor ingresa una palabra');
    });

    test('debería manejar errores de la API al agregar', async () => {
      const palabraInput = document.getElementById('palabraInput');
      palabraInput.value = 'test';
      
      fetch.mockResponseOnce(
        JSON.stringify({ error: 'Error de servidor' }), 
        { status: 500 }
      );

      await appFunctions.agregarPalabra();

      const mensajeDiv = document.getElementById('mensaje');
      expect(mensajeDiv.innerHTML).toContain('Error');
    });
  });

  describe('eliminarPalabra()', () => {
    test('debería eliminar una palabra con confirmación', async () => {
      window.confirm = jest.fn(() => true);
      
      fetch.mockResponses(
        [JSON.stringify({ mensaje: 'Palabra eliminada exitosamente' }), { status: 200 }],
        [JSON.stringify([]), { status: 200 }]
      );

      await appFunctions.eliminarPalabra(1);

      expect(window.confirm).toHaveBeenCalled();
      // ✅ FIX: URL y parámetros actualizados
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/palabras/1',
        expect.objectContaining({ 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        })
      );
    });

    test('NO debería eliminar si el usuario cancela', async () => {
      window.confirm = jest.fn(() => false);

      await appFunctions.eliminarPalabra(1);

      expect(window.confirm).toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    });

    test('debería manejar errores al eliminar', async () => {
      window.confirm = jest.fn(() => true);
      fetch.mockResponseOnce(
        JSON.stringify({ error: 'Error al eliminar' }), 
        { status: 500 }
      );

      await appFunctions.eliminarPalabra(1);

      const mensajeDiv = document.getElementById('mensaje');
      expect(mensajeDiv.innerHTML).toContain('Error');
    });
  });
});