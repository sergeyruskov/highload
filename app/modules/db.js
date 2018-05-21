// const pgp = require('pg-promise')(/*options*/);
// const db = pgp('postgres://localhost:5432/');
const mysql      = require('mysql');
const db = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    port: 8889,
    database: 'travels'
});
db.connect(err => {

    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + db.threadId);
});

module.exports = db;