// add the module of database
var mysql = require('mysql');
// setup the connection

var dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password: "password",
  password: '19919901',
  insecureAuth: true,
  database: 'chat'
});
// make the conection
dbConnection.connect(function(err) {
  if (err) {
    console.log('access dinay to database')
  } else {
    console.log('database has been connected')
  }
});
//  use the database
// var masege = 'welcome4'
// query = ` insert into messages values(null,\' ${masege}\' );`
// console.log(query);
// dbConnection.query(query, function(err, data) {
//   if (err) {
//     console.log('ERROR query')
//   } else {
//     console.log(data)
//     console.log('message inserted')
//   }
// })

// export the connection
module.exports.db = dbConnection;
