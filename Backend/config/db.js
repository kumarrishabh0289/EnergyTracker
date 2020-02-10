var mysql = require("mysql");


var pool = mysql.createPool({
  connectionLimit: 10,
  acquireTimeout: 120000,
  connectTimeout: 20000,

//   host: process.env.RDS_HOSTNAME, //host where mysql server is running
//   user: process.env.RDS_USERNAME, //user for the mysql application
//   password: process.env.RDS_PASSWORD, //password for the mysql application
//   database: process.env.RDS_DATABASE,

  host: "newtestdb.cwaes4yvw6x4.us-east-2.rds.amazonaws.com",
  user: "green",
  password: "greenninja",
  database: "greenninja_new",

  // host : 'aa1w1g6jkjiehb9.cwaes4yvw6x4.us-east-2.rds.amazonaws.com',
  // user : 'greenninjaRds',
  // password : '_MfGUs[7.WH47Xs',
  // database : 'greenninja_new',
  // database : 'ngss_gn_main',

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
