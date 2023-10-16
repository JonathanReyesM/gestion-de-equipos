const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "mapgroup_database",
  user: "root",
  password: ""
});

module.exports = connection;
