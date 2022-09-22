require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser:  process.env.DB_USER,
  dbPassword:  process.env.DB_PASSWORD,
  dbHost:  process.env.DB_HOST,
  dbName:  process.env.DB_NAME,
  dbPort:  process.env.DB_PORT,
}

module.exports = { config };











// const mysql = require('mysql');
// const connection = mysql.createConnection({
//   host     : process.env.SQL_HOST || 'localhost',
//   user     : process.env.SQL_USER || 'me',
//   password : process.env.SQL_PASS || '',
//   database : process.env.SQL_DATABASE || 'my_db'
// });

// const connect = () => connection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('Conexion correcta con tu base de datos MySQL')
// });

// module.exports = {connect, connection}