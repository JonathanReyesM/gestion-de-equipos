const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
    if (!req.query || !req.query.correo || !req.query.contraseña) {
        return res.status(400).json({
            error: 'Faltan parámetros en la solicitud'
        });
    }

    const email = req.query.correo;
    const password = req.query.contraseña;
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'El correo electrónico no es válido'
      });
    }
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'La contraseña no es válida'
      });
    }

    // Aquí deberías realizar la autenticación del usuario, por ejemplo, verificar el correo y la contraseña en una base de datos.

    // Si la autenticación es exitosa, puedes responder con un mensaje de éxito
    res.status(200).json({
      message: 'Inicio de sesión exitoso'
    });
});

app.listen(3000, () => console.log('Servidor iniciado en http://localhost:3000'));
