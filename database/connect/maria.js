var mariadb = require('mysql');
var conn = mariadb.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'ada',
    password: 'amgalan',
    database: 'apm_mobile',
});

module.exports = conn;