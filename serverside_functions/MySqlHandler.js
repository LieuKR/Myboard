// MySql의 모듈
var exports = module.exports = {};

const mysql = require('mysql');
const DBconfig  = require('../config/DBset.json'); // DB 정보

exports.board_main = mysql.createConnection({
        host: DBconfig.host,
        port: DBconfig.port,
        user: DBconfig.user,
        password: DBconfig.password,
        database: DBconfig.db_main
  });

exports.board_1 = mysql.createConnection({
      host: DBconfig.host,
      port: DBconfig.port,
      user: DBconfig.user,
      password: DBconfig.password,
      database: DBconfig.db_board_1
});

exports.board_2 = mysql.createConnection({
      host: DBconfig.host,
      port: DBconfig.port,
      user: DBconfig.user,
      password: DBconfig.password,
      database: DBconfig.db_board_2
});

exports.board_3 = mysql.createConnection({
      host: DBconfig.host,
      port: DBconfig.port,
      user: DBconfig.user,
      password: DBconfig.password,
      database: DBconfig.db_board_3
});