// Configuración de APIs por ambiente
const API_CONFIGS = {
    // URLs de tus backends en Render
    qa: 'https://tp8-backend-qa.onrender.com',
    prod: 'https://tp8-backend-prod.onrender.com',
    local: 'http://localhost:3000'
};

// Determinar la URL de la API según el entorno
function getApiUrl() {
    const hostname = window.location.hostname;
    
    // Desarrollo local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return API_CONFIGS.local + '/api';
    }
    
    // Detectar ambiente por URL del frontend
    if (hostname.includes('tp8-frontend-qa')) {
        return API_CONFIGS.qa + '/api';
    } else if (hostname.includes('tp8-frontend-prod')) {
        return API_CONFIGS.prod + '/api';
    }
    
    // Fallback: usar el mismo origen (por si acaso)
    return window.location.origin + '/api';
}

const API_URL = getApiUrl();

// Debug: mostrar configuración en consola
console.log('🔧 Frontend Config:', {
    hostname: window.location.hostname,
    apiUrl: API_URL,
    environment: window.location.hostname.includes('qa') ? 'QA' : 
                window.location.hostname.includes('prod') ? 'PROD' : 'LOCAL'
});

// Cargar palabras al inicio
document.addEventListener('DOMContentLoaded', function() {
    cargarPalabras();
    
    // Permitir agregar palabra con Enter
    document.getElementById('palabraInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            agregarPalabra();
        }
    });
});

// Función para cargar y mostrar todas las palabras
async function cargarPalabras() {
    try {
        console.log('📡 Cargando palabras desde:', API_URL + '/palabras');
        
        const response = await fetch(`${API_URL}/palabras`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Importante para CORS
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const palabras = await response.json();
        
        const listaPalabras = document.getElementById('listaPalabras');
        
        if (palabras.length === 0) {
            listaPalabras.innerHTML = '<p style="text-align: center; color: #666;">No hay palabras guardadas</p>';
            return;
        }
        
        listaPalabras.innerHTML = palabras.map(palabra => `
            <div class="palabra-item">
                <span><strong>${palabra.palabra}</strong></span>
                <button class="delete-btn" onclick="eliminarPalabra(${palabra.id})">
                    Eliminar
                </button>
            </div>
        `).join('');
        
        console.log(`✅ Cargadas ${palabras.length} palabras`);
        
    } catch (error) {
        console.error('❌ Error al cargar palabras:', error);
        mostrarMensaje(`Error al cargar las palabras: ${error.message}`, 'error');
    }
}

// Función para agregar una nueva palabra
async function agregarPalabra() {
    const palabraInput = document.getElementById('palabraInput');
    const palabra = palabraInput.value.trim();
    
    if (!palabra) {
        mostrarMensaje('Por favor ingresa una palabra', 'error');
        return;
    }
    
    try {
        console.log('📡 Agregando palabra:', palabra);
        
        const response = await fetch(`${API_URL}/palabras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ palabra: palabra }),
            mode: 'cors'
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            mostrarMensaje('Palabra agregada exitosamente', 'exito');
            palabraInput.value = ''; // Limpiar input
            cargarPalabras(); // Recargar lista
            console.log('✅ Palabra agregada:', resultado);
        } else {
            mostrarMensaje(resultado.error || 'Error al agregar palabra', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error al agregar palabra:', error);
        mostrarMensaje(`Error al agregar la palabra: ${error.message}`, 'error');
    }
}

// Función para eliminar una palabra
async function eliminarPalabra(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta palabra?')) {
        return;
    }
    
    try {
        console.log('📡 Eliminando palabra ID:', id);
        
        const response = await fetch(`${API_URL}/palabras/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            mostrarMensaje('Palabra eliminada exitosamente', 'exito');
            cargarPalabras(); // Recargar lista
            console.log('✅ Palabra eliminada:', resultado);
        } else {
            mostrarMensaje(resultado.error || 'Error al eliminar palabra', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error al eliminar palabra:', error);
        mostrarMensaje(`Error al eliminar la palabra: ${error.message}`, 'error');
    }
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.innerHTML = `<div class="mensaje ${tipo}">${texto}</div>`;
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 3000);
}

// Health check del API (útil para debugging)
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`);
        const health = await response.json();
        console.log('💓 API Health:', health);
        return health;
    } catch (error) {
        console.error('❌ API Health check failed:', error);
        return null;
    }
}

// Ejecutar health check al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkApiHealth, 1000);
});

// Exportar funciones para pruebas unitarias
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cargarPalabras,
        agregarPalabra,
        eliminarPalabra,
        mostrarMensaje,
        getApiUrl,
        checkApiHealth
    };
}