const mysql = require("mysql");
const database = require("./database");

database.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  database.query("SELECT * FROM gde_categoria_equipos", (err, results) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(results);
  });
});
