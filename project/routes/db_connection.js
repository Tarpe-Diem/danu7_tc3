var mysql = require('mysql');

var con = mysql.createConnection({
  host: "mysql1.it.nuigalway.ie",
  user: "mydb4759tc",
  password: "rrrfff5948",
  database: "mydb4759"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;