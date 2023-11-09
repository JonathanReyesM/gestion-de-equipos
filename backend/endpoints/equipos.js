const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dbConfig = require('../config');

//Permitir conexiones no seguras
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
});

//Obtener todos los puestos
router.get("/equipos/equipos", verifyToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    connection.connect();
    const query = "SELECT * FROM gde_equipos";
    const [results] = await connection.execute(query);
    if (results.length > 0) {
      const equipos = results;
      res.send({
        equipos: equipos,
      });
    }else{
      connection.end;
      return res.status(204).send({ message: 'No Content' });
    }
  } catch (err) {
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

//Agregar nuevo equipo
router.post('/equipos/add', verifyToken, async (req, res) => {
  try {
    const {
      id_usuario,
      descripcion_equipo,
      marca_equipo,
      modelo_equipo,
      serial_equipo,
      fecha_equipo,
      fecha_garantia,
      id_estado,
      id_status,
      id_categoria,
    } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO gde_equipos (id_usuario, descripcion_equipo, marca_equipo, modelo_equipo, serial_equipo, fecha_equipo, fecha_garantia, id_estado, id_status, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      id_usuario || null,
      descripcion_equipo,
      marca_equipo,
      modelo_equipo,
      serial_equipo || null,
      fecha_equipo || null,
      fecha_garantia || null,
      id_estado,
      id_status,
      id_categoria,
    ];
    await connection.execute(query, values);
    connection.end();
    return res.status(201).json({ message: 'Registro agregado exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', message: error });
  }
});

//Actualizar equipo
router.post('/equipos/update', verifyToken, async (req, res) => {
  try {
    const {
      id_usuario,
      descripcion_equipo,
      marca_equipo,
      modelo_equipo,
      serial_equipo,
      fecha_equipo,
      fecha_garantia,
      id_estado,
      id_status,
      id_categoria,
    } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO gde_equipos (id_usuario, descripcion_equipo, marca_equipo, modelo_equipo, serial_equipo, fecha_equipo, fecha_garantia, id_estado, id_status, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      id_usuario || null,
      descripcion_equipo,
      marca_equipo,
      modelo_equipo,
      serial_equipo || null,
      fecha_equipo || null,
      fecha_garantia || null,
      id_estado,
      id_status,
      id_categoria,
    ];
    await connection.execute(query, values);
    connection.end();
    return res.status(201).json({ message: 'Registro agregado exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', message: error });
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    //const bearerToken = bearerHeader.split(" ")[1];
    const prk = "pXNHfMxRnO5So-aavT9kxn9Zuu9GRVf9eKV-VO16tZ62Vf-Dl2507sF5LN-APdh3ipdMRq4_qtHRpJg5Z5B5GoITJlOiEsvT5cz0g9Qa89KBMLfxabD-Kkdzz3cEmmuni6QGYxt-rl-XnLFx__onLioSCL6jjCfX_Gk7w5AkddUyfE74J8JiZ_8n7-di4hgFslMnUomKN-5dXHBpVOY_QXfWv--y_GqWeDfXa8KSsdYdzZu2HR9TE8CVQe_xwpKkWijdDl0SHIECKX0FhK0aleIP";
    req.token = bearerHeader;
    jwt.verify(req.token, prk, { expiresIn: '9h' }, (error, authData) => {
      if (error) {
        res.status(403).json({ error: "Token Invalido", message: "El Token del Usuario es Incorrecto" });
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.status(403).json({ error: "Token Requerido", message: "El usuario no tiene permisos suficientes para ejecutar esta solicitud" });
  }
}

module.exports = router; 