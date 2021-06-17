var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'aia',
    password:'aia',
    database:'opentutorials'
  });
  db.connect
  // 외부에서 모듈을 사용할 수 있도록 exports
  module.exports = db;
  