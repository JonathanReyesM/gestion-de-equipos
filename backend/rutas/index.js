const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación!');
});

module.exports = router;
