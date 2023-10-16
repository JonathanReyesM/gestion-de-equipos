const db = require('mysql2');

const obtenerUsuarioPorCorreo = (email, callback) => {
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, resultados) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (resultados.length === 0) {
      callback(null, null);
      return;
    }
    callback(null, resultados[0]);
  });
};

module.exports = {
  obtenerUsuarioPorCorreo
};
