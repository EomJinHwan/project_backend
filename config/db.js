// ./config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'project1',
    port : '3306',
    waitForConnections: true,// 연결 없을 시 요청을 대기할지 여부
    connectionLimit: 10,   // 동시 허용되는 최대 연결 수
    queueLimit: 0,  //대기열 최대 길이
});

module.exports = pool;