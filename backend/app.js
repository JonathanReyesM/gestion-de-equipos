const express = require('express');
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cryp = require('crypto');
const bodyParser = require('body-parser');
const puestosRouter = require('./endpoints/puestos');
const equiposRouter = require('./endpoints/equipos');
const usuariosRouter = require('./endpoints/usuarios');
const dbConfig = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/api', puestosRouter);
app.use('/api', equiposRouter);
app.use('/api', usuariosRouter);

//Permitir conexiones no seguras
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
});

//Validación de conexión
// db.connect(err => {
//   if (err) {
//     console.error('Error al conectar a la base de datos MySQL: ' + err.message);
//   } else {
//     console.log('Conexión exitosa a la base de datos MySQL');
//   }
// });

app.post('/api/signup', async (req, res) => {
  try {
    const { nombre_usuario, apellidoM_usuario, apellidoP_usuario, numero_control, id_puesto, id_status, correo_usuario, contrasena, id_rol } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const query = "SELECT * FROM gra_usuarios WHERE correo_usuario = ?";
    const values = [correo_usuario];
    const [existingUsers] = await connection.execute(query, values);
    if (existingUsers.length == 0) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const query = 'INSERT INTO gra_usuarios (nombre_usuario, apellidoM_usuario, apellidoP_usuario, numero_control, id_puesto, id_status, correo_usuario, contrasena, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [nombre_usuario, apellidoM_usuario, apellidoP_usuario, numero_control, id_puesto, id_status, correo_usuario, hashedPassword, id_rol];
      await connection.execute(query, values);
      connection.end();
      res.status(201).json({ message: 'Registro agregado exitosamente' });
    }else{
      connection.end();
      return res.status(409).json({ message: 'El registro ya existe' });
    }
  } catch (error) {
    connection.end();
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post("/api/login", async (req, res) => {
  try{
    const { correo_usuario, contrasena } = req.body;
    if (correo_usuario && contrasena) {
      const connection = await mysql.createConnection(dbConfig);
      const query = 'SELECT * FROM gra_usuarios WHERE correo_usuario = ?';
      const values = [correo_usuario];
    
      const [users] = await connection.execute(query, values);
      if (users.length > 0) {
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
        if (isPasswordValid) {
          
          const prk = "pXNHfMxRnO5So-aavT9kxn9Zuu9GRVf9eKV-VO16tZ62Vf-Dl2507sF5LN-APdh3ipdMRq4_qtHRpJg5Z5B5GoITJlOiEsvT5cz0g9Qa89KBMLfxabD-Kkdzz3cEmmuni6QGYxt-rl-XnLFx__onLioSCL6jjCfX_Gk7w5AkddUyfE74J8JiZ_8n7-di4hgFslMnUomKN-5dXHBpVOY_QXfWv--y_GqWeDfXa8KSsdYdzZu2HR9TE8CVQe_xwpKkWijdDl0SHIECKX0FhK0aleIP";
          const bodyUser = {
            id_usuario: user.id_usuario,
            numero_control: user.numero_control,
            id_rol: user.id_rol
          }
  
          jwt.sign({ bodyUser }, prk, {expiresIn: '9h'}, (err, token) => {
            if (err) {
              connection.end();
              return res.status(500).json({ error: "Error interno del servidor", message: err });
            }
            connection.end();
            return res.status(200).json({ token });
          });
        } else {
          connection.end();
          return res.status(401).json({ error: "Credenciales Incorrectas1", message: "El usuario o contraseña son incorrectas" });
        }
      } else {
        connection.end();
        return res.status(401).json({ error: "Credenciales Incorrectas2", message: "El usuario o contraseña son incorrectas" });
      }
    } else {
      res.status(400).json({ error: "Solicitud Incorrecta", message: "Faltan datos para procesar la información" });
    }
  }catch(error){
    res.status(500).json({ error: "Error interno del servidor", message: error });
  }
});

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${puerto}`);
});
