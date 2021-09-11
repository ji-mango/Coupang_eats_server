const mysql = require('mysql2/promise');
const {logger} = require('./winston');

const pool = mysql.createPool({
    host: '',
    user: '',
    port: '3306',
    password: '',
    database: 'CoupangEats'
});

module.exports = {
    pool: pool
};
