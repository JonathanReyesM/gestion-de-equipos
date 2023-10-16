const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

// Ruta de inicio de sesión (POST)
router.post('/login', (req, res, next) => {
  passport.use(new LocalStrategy(
    { correo_usuario: 'correo_usuario' }, // Asegúrate de que coincida con el campo en tu formulario
    (correo_usuario, contrasena, done) => {
      // Aquí debes verificar las credenciales del usuario en tu base de datos
      db.query('SELECT * FROM gra_usuarios WHERE correo_usuario = ? AND contrasena = ?', [correo_usuario, contrasena], (error, results) => {
        if (error) { 
          return done(error);
        }
        if (results.length === 0) {
          return done(null, false, { mensaje: 'Credenciales incorrectas' });
        }
        const usuario = results[0];
        return done(null, usuario);
      });
    }
  ));
});

// Ruta de cierre de sesión (GET)
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ mensaje: 'Cierre de sesión exitoso' });
});

module.exports = router;
