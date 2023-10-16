const express = require('express');
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//Permitir conexiones no seguras
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // Otras cabeceras CORS necesarias
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
});

//Conexión a base de datos
const dbConfig = {
    host: "localhost",
    port: 3306,
    database: "mapgroup_database_2",
    user: "root",
    password: ""
};

//Validación de conexión
// db.connect(err => {
//   if (err) {
//     console.error('Error al conectar a la base de datos MySQL: ' + err.message);
//   } else {
//     console.log('Conexión exitosa a la base de datos MySQL');
//   }
// });

// Ruta para crear un nuevo usuario
app.post('/api/signup', async (req, res) => {
  try {
    const { nombre_usuario, apellidoM_usuario, apellidoP_usuario, numero_control, correo_usuario, contrasena } = req.body;

    // Crea una conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Verifica si el usuario ya existe por correo electrónico
    const [existingUsers] = await connection.execute('SELECT * FROM gra_usuarios WHERE correo_usuario = ?', [correo_usuario]);

    if (existingUsers.length > 0) {
      connection.end(); // Cierra la conexión
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    // Genera un salt y hashea la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Inserta un nuevo usuario en la base de datos con la contraseña hasheada
    await connection.execute('INSERT INTO gra_usuarios (nombre_usuario, apellidoM_usuario, apellidoP_usuario, numero_control, correo_usuario, contrasena) VALUES (?, ?, ?, ?, ?, ?)', [nombre_usuario, apellidoM_usuario, apellidoP_usuario, numero_control, correo_usuario, hashedPassword]);

    connection.end(); // Cierra la conexión

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para iniciar sesión
app.post("/api/login", (req, res) => {
  const { email, contrasena } = req.body;
  // Simulación de inicio de sesión exitoso
  // Deberás verificar las credenciales aquí en lugar de generar un token directamente
  if (email && contrasena) {
    jwt.sign({ email: email }, 'secretkey', { expiresIn: '12h' }, (err, token) => {
      if (err) {
        res.status(500).json({ error: "Error al generar el token" });
      } else {
        res.json({
          token: token,
          mensaje: "Inicio de sesión exitoso"
        });
      }
    });
  } else {
    res.status(400).json({ error: "Credenciales incorrectas" });
  }
});

//Obtener puestos
app.get("/api/puestos", async (req, res) => {
  // Verificar el token

      //Conexión a la base de datos
      const connection = await mysql.createConnection(dbConfig);
      connection.connect(); // Conectar a la base de dato

      try {
        const [results] = await connection.execute('SELECT * FROM gra_puestos');
        console.log(results);
        if (!results.length) {
          return res.status(204).send({ message: 'No Content' });
        }

        const puestos = results.map(result => ({
          id_puesto: result.id_puesto,
          nombre_puesto: result.nombre_puesto,
          descripcion_puesto: result.descripcion_puesto,
          id_area: result.id_area
        }));
        
        res.send({
          puestos: puestos,
        });
      } catch (err) {
        console.error("Error al consultar la base de datos:", err);
        res.status(500).send({ error: "Error interno del servidor" });
      } finally {
        connection.end(); // Cerrar la conexión
      }
    
  });

//Obtener los puestos
app.get("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if(error){
      res.sendStatus(403);
    }else{
      res.json({
        mensaje: "Post fue creado",
        authData: authData,
      });
    }
  });
});

// Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(req.token, 'secretkey', (error, authData) => {
      if (error) {
        res.status(403).json({ error: "Token no válido" });
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.status(403).json({ error: "Token requerido" });
  }
}

// Iniciar el servidor
const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${puerto}`);
});
