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
    res.status(500).send({ error: "Error interno del servidor", message: err.message });
  }
});

//Obtener todos los puestos
router.get("/equipos/main", verifyToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    connection.connect();
    const query = `
      SELECT 
              gde_equipos.id_equipo, 
              gde_equipos.descripcion_equipo, 
              gde_equipos.marca_equipo, 
              gde_equipos.modelo_equipo, 
              gde_equipos.serial_equipo, 
              gde_equipos.fecha_equipo, 
              gde_equipos.fecha_garantia, 
              gra_usuarios.nombre_usuario, 
              gra_usuarios.apellidoP_usuario, 
              gra_usuarios.apellidoM_usuario, 
              gde_categoria_equipos.nombre_categoria 
          FROM 
              gde_equipos 
          LEFT JOIN 
              gra_usuarios ON gde_equipos.id_usuario = gra_usuarios.id_usuario 
          INNER JOIN 
              gde_categoria_equipos ON gde_equipos.id_categoria = gde_categoria_equipos.id_categoria;
      `;
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
    res.status(500).send({ error: "Error interno del servidor", message: err.message });
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
    return res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
});

//Actualizar equipo
router.put('/equipos/update/:id', verifyToken, async (req, res) => {
  try {
    const id_equipo = req.params.id;
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
    const query = 'UPDATE gde_equipos SET id_usuario=?, descripcion_equipo=?, marca_equipo=?, modelo_equipo=?, serial_equipo=?, fecha_equipo=?, fecha_garantia=?, id_estado=?, id_status=?, id_categoria=? WHERE id_equipo=?';

    const updateData = [
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
      id_equipo,
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
router.delete('/equipos/delete/:id', verifyToken, async (req, res) => {
  let connection;
  try {
    const id = req.params.id;

    connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM gde_equipos WHERE id_equipo = ?';

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
router.get("/equipos/equipos/:id", verifyToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;
    connection.connect();
    const query = "SELECT * FROM gde_equipos WHERE id_equipo=? ";
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