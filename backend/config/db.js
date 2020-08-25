var mysql = require("mysql");


var pool = mysql.createPool({
  connectionLimit: 10,
  acquireTimeout: 120000,
  connectTimeout: 20000,

  host: process.env.RDS_HOSTNAME, //host where mysql server is running
  user: process.env.RDS_USERNAME, //user for the mysql application
  password: process.env.RDS_PASSWORD, //password for the mysql application
  database: process.env.RDS_DATABASE,
  port: process.env.RDS_PORT 
});

exports.fetchData = function(values, callback, sqlQuery) {
  console.log(sqlQuery);
  console.log(values);
  pool.query(sqlQuery, values, function(err, rows, fields) {
    if (err) {
      console.log("ERROR: " + err.message);
      callback(err, null);
    } else {

      callback(err, rows);
    }
  });

};
