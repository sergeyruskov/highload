// const pgp = require('pg-promise')(/*options*/);
// const db = pgp('postgres://localhost:5432/');
const mysql      = require('mysql');
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'a3844175',
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