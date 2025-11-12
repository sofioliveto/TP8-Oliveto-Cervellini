const express = require('express');
const cors = require('cors');

// Puerto dinámico
const PORT = process.env.PORT || 3000;

// Leer variables de entorno
const ENV_NAME = process.env.ENVIRONMENT_NAME || 'development';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ✅ CREAR LA APP
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://tp8-frontend-qa.onrender.com',
    'https://tp8-frontend-prod-8nss.onrender.com',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Importar la base de datos
const db = require('./db');

// API Routes
app.get('/api/palabras', (req, res) => {
  console.log('📥 GET /api/palabras');
  db.all('SELECT * FROM palabras ORDER BY fecha_creacion DESC', (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ Devolviendo ${rows.length} palabras`);
      res.json(rows);
    }
  });
});

app.post('/api/palabras', (req, res) => {
  const { palabra } = req.body;
  console.log('📥 POST /api/palabras ->', palabra);
  
  if (!palabra) {
    return res.status(400).json({ error: 'La palabra es requerida' });
  }
  
  db.run('INSERT INTO palabras (palabra) VALUES (?)', [palabra], function(err) {
    if (err) {
      console.error('❌ Error:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ Palabra agregada - ID: ${this.lastID}`);
      res.status(201).json({ 
        id: this.lastID, 
        palabra: palabra,
        mensaje: 'Palabra agregada exitosamente' 
      });
    }
  });
});

app.delete('/api/palabras/:id', (req, res) => {
  const { id } = req.params;
  console.log('📥 DELETE /api/palabras/' + id);
  
  db.run('DELETE FROM palabras WHERE id = ?', id, function(err) {
    if (err) {
      console.error('❌ Error:', err.message);
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Palabra no encontrada' });
    } else {
      console.log(`✅ Palabra eliminada - ID: ${id}`);
      res.json({ mensaje: 'Palabra eliminada exitosamente' });
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'API Palabras funcionando correctamente',
    environment: ENV_NAME,
    nodeEnv: NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint para API
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Palabras - Backend Only',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      palabras: '/api/palabras'
    }
  });
});

// ✅ EXPORTAR LA APP (para tests)
module.exports = app;

// ✅ SOLO EJECUTAR LISTEN SI NO ESTAMOS EN TESTS
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('════════════════════════════════════════');
    console.log(`🚀 API Server corriendo en puerto ${PORT}`);
    console.log(`📍 Environment: ${ENV_NAME} (NODE_ENV: ${NODE_ENV})`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📡 API endpoints: http://0.0.0.0:${PORT}/api/palabras`);
    console.log('════════════════════════════════════════');
  });
}