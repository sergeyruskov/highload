const {forOwn} = require('lodash');

module.exports = function getUserVisits({db, res, id, query}) {

	function queryNumberCheck(query) {
		return /^\d+$/.test(query);
	}

	function queryParams({query, DBquery}) {
		forOwn(query, (value, key) => {
			switch(key) {
				case 'fromDate': {
					if (!queryNumberCheck(value)) {
						return res.sendStatus(400);
					}
					DBquery += ` AND V.visited_at > ${value}`;
					break;
				}
				case 'toDate': {
					if (!queryNumberCheck(value)) {
						return res.sendStatus(400);
					}
					DBquery += ` AND V.visited_at < ${value}`;
					break;
				}
				case 'toDistance': {
					if (!queryNumberCheck(value)) {
						return res.sendStatus(400);
					}
					DBquery += ` AND L.distance < ${value}`;
					break;
				}
				case 'country': {
					if (/^[a-zA-Zа-яА-Я]+$/.test(value)) {
						return res.sendStatus(400);
					}
					DBquery += ` AND L.country = '${value}'`;
				}
			}
		});
		return DBquery + ' ORDER BY V.visited_at';
	}

	let DBquery = `SELECT V.mark, V.visited_at, L.place FROM Visit V, Location L, User U WHERE V.user = ${id} AND V.location = L.id AND U.id = V.user`;

	DBquery = queryParams({query, DBquery});

	db.query(DBquery, async function (error, data) {
		if (!data.length) {
			return await db.query(`SELECT count(1) from User WHERE id = ${id}`).then((count) => {
				/**
				 * Если нет данных от посещений пользователя, но пользователь существует
				 */
				if (count[0]['count(1)']) {
					res.status(200);
					return res.json({visits: data});
				}
				return res.sendStatus(404);
			});
		}
		res.status(200);
		return res.json({visits: data});
    })
};
