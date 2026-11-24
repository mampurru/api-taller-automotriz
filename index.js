// index.js
// Archivo principal: inicializa Express, configura middlewares,
// conecta las rutas y levanta el servidor.

const express = require('express');
const turnosRoutes = require('./routes/turnos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Rutas de la API
app.use('/api/turnos', turnosRoutes);

// Ruta inexistente -> 404
app.use((req, res) => {
  res.status(404).json({ error: `La ruta ${req.method} ${req.originalUrl} no existe` });
});

// Si el cliente envía un JSON mal formado -> 400 (evita que el servidor responda 500)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor del Taller Automotriz corriendo en http://localhost:${PORT}`);
});
