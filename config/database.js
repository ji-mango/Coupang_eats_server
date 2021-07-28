const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'mangodatabase.cg8wfdoo5czj.ap-northeast-2.rds.amazonaws.com',
    user: 'mango',
    port: '3306',
    password: 'wlasl102003!',
    database: 'CoupangEats'
});

module.exports = {
    pool: pool
};