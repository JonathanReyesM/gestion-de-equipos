const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

// Ruta de inicio de sesión (POST)
router.post('api/login',async (req, res, next) => {
  try {
    const { correo_usuario, contrasena } = req.body;
    // Crea una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Obtiene el usuario de la base de datos por correo electrónico
    const [users] = await connection.execute('SELECT * FROM gra_usuarios WHERE correo_usuario = ?', [correo_usuario]);

    if (users.length === 0) {
      connection.end(); // Cierra la conexión
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }else{
      const user = users[0];
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isPasswordValid) {
        connection.end(); // Cierra la conexión
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
      const token = jwt.sign({ userId: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '6h' });
      connection.end();
      console.log(token);
      res.status(200).json({ token });
    }
  } catch (error) {
    console.error(error);
    connection.end(); // Cierra la conexión
    res.status(500).json({ message: 'Error interno del servidor' });
  } 
});

// Ruta de cierre de sesión (GET)
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ mensaje: 'Cierre de sesión exitoso' });
});

module.exports = router;
