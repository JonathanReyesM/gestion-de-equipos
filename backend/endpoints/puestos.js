const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
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

//Obtener puestos
router.get("/puestos/puestos", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    connection.connect();
    const query = "SELECT * FROM gra_puestos";
    const [results] = await connection.execute(query);
    if (results.length > 0) {
      const puestos = results.map(result => ({
        id_puesto: result.id_puesto,
        nombre_puesto: result.nombre_puesto,
        descripcion_puesto: result.descripcion_puesto,
        id_area: result.id_area
      }));
      res.send({
        puestos: puestos,
      });
    }else{
      connection.end;
      return res.status(204).send({ message: 'No Content' });
    }
  } catch (err) {
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

module.exports = router; 