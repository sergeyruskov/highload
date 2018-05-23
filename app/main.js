const express         = require('express');
const app             = express();
const db              = require('./modules/db');
const getUser         = require('./modules/get_user');
const getUserVisits   = require('./modules/get_user_visits');
const getAVGLocations = require('./modules/get_avg_locations');

app.get('/', function (req, res) {
	res.send('Hello, I\'m Web Server!');
});

const usersRouter = express.Router();

usersRouter
	.get('/:id(\\d+)', ({params: {id}}, res) => {
		getUser({db, id, res});
	});

usersRouter
	.get('/:id(\\d+)/visits', ({params: {id}, query}, res) => {
		getUserVisits({db, id, res, query});
	});

app.get('/locations/:id(\\d+)/avg', ({params: {id}, query}, res) => {
	getAVGLocations({db, id, res, query});
});

app.use('/users', usersRouter);
app.use((req, res, next) => {
	console.log('not found');
	res.sendStatus(404);
});

//todo возможно для прод обстрела надо поменять порт на 80 в bin/www
app.listen(3002, function () {
	console.log('Example app listening on port 3002!');
});

module.exports = app;
