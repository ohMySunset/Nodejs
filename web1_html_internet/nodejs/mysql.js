var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'aia',
    password : 'aia',
    database : 'opentutorials'
});

connection.connect();

connection.query('SELECT * from topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();