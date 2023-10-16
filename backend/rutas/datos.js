const express = require('express');
const router = express.Router();

// Ruta para obtener datos
router.get('/', (req, res) => {
  res.json({ mensaje: 'Obteniendo datos' });
});

// Ruta para crear datos
router.post('/', (req, res) => {
  // Lógica para crear datos
});

// Otras rutas relacionadas con datos

module.exports = router;
