// const pgp = require('pg-promise')(/*options*/);
// const db = pgp('postgres://localhost:5432/');
const mysql = require('promise-mysql');
module.exports = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'a3844175',
	database: 'travels'
});
