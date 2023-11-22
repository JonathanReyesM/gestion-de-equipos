const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dbConfig = require('../config');

//Permitir conexiones no seguras
router.use(cors({
  origin: 'http://localhost:8080', // Reemplaza esto con la URL de tu aplicación frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permite el envío de cookies desde el cliente
  optionsSuccessStatus: 204, // Configura el código de estado para las opciones pre-vuelo (preflight)
}));

//Obtener todos los puestos
router.get("/usuarios/usuarios", verifyToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    connection.connect();
    const query = "SELECT * FROM gra_usuarios";
    const [results] = await connection.execute(query);
    if (results.length > 0) {
      const usuarios = results;
      res.send({
        usuarios: usuarios,
      });
    }else{
      connection.end;
      return res.status(204).send({ message: 'No Content' });
    }
  } catch (err) {
    res.status(500).send({ error: "Error interno del servidor", message: err.message });
  }
});

//Actualizar usuario
router.put('/usuarios/update/:id', verifyToken, async (req, res) => {
  try {
    const id_usuario = req.params.id;
    const {
        nombre_usuario,
        apellidoM_usuario,
        apellidoP_usuario,
        numero_control,
        id_puesto,
        id_status,
        correo_usuario, 
        id_rol
    } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    const query = 'UPDATE gra_usuarios nombre_usuario = ?, apellidoM_usuario = ?, apellidoP_usuario = ?, numeero_control = ?, id_puesto = ?, id_status = ?, correo_usuario = ?, id_rol = ? WHERE id_equipo=?';

    const updateData = [
        nombre_usuario,
        apellidoM_usuario || NULL,
        apellidoP_usuario,
        numero_control,
        id_puesto,
        id_status,
        correo_usuario || NULL, 
        id_rol || NULL
    ];

    const [result] = await connection.execute(query, updateData);
    
    if (result.affectedRows > 0) {
      connection.end;
      return res.status(200).json({ message: 'Registro actualizado exitosamente' });
    } else {
      connection.end;
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
});

//Eliminar Equipo
router.delete('/usuarios/delete/:id', verifyToken, async (req, res) => {
  let connection;
  try {
    const id = req.params.id;

    connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM gra_usuarios WHERE id_usuario = ?';

    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows > 0) {
      connection.end;
      return res.status(200).json({ message: 'Registro eliminado exitosamente' });
    } else {
      connection.end;
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

//Obtener equipo por id
router.get("/usuarios/usuarios/:id", verifyToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;
    connection.connect();
    const query = "SELECT * FROM gra_usuarios WHERE id_usuario=? ";
    const [result] = await connection.execute(query, [id]);
    if (result.length > 0) {
      const equipo = result;
      res.send({
        equipo: equipo,
      });
    }else{
      connection.end;
      return res.status(204).send({ error: 'No Content' });
    }
  } catch (err) {
    res.status(500).send({ error: "Error interno del servidor", message: err.message });
  }
});

function verifyToken(req, res, next) {
  try {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(" ")[1];

      // Replace the following line with your actual secret key
      const prk = "pXNHfMxRnO5So-aavT9kxn9Zuu9GRVf9eKV-VO16tZ62Vf-Dl2507sF5LN-APdh3ipdMRq4_qtHRpJg5Z5B5GoITJlOiEsvT5cz0g9Qa89KBMLfxabD-Kkdzz3cEmmuni6QGYxt-rl-XnLFx__onLioSCL6jjCfX_Gk7w5AkddUyfE74J8JiZ_8n7-di4hgFslMnUomKN-5dXHBpVOY_QXfWv--y_GqWeDfXa8KSsdYdzZu2HR9TE8CVQe_xwpKkWijdDl0SHIECKX0FhK0aleIP";

      req.token = bearerToken;

      jwt.verify(req.token, prk, { expiresIn: '9h' }, (error) => {
        if (error) {
          res.status(403).json({ error: "Token Invalido", message: error });
        } else {
          next();
        }
      });
    } else {
      res.status(403).json({ error: "Token Requerido", message: "El usuario no tiene permisos suficientes para ejecutar esta solicitud" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = router; 