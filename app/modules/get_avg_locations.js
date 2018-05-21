const {birthdayTimestamp} = require('./timestamp');

module.exports = function getAVGLocations({db, id, res, query}) {
	let DBquery = `SELECT ROUND(AVG(mark), 5) FROM "Visit" V WHERE location = ${id}`;

	function queryNumberCheck(query) {
		return /^\d+$/.test(query);
	}

	//todo подумай о порядке query
	for (let queryKey in query) {
		if (query.hasOwnProperty(queryKey)) {
			const queryValue = query[queryKey];
			switch (queryKey) {
				case 'fromDate': {
					if (queryNumberCheck(queryValue)) {
						DBquery += ` AND V.visited_at > ${queryValue}`;
					} else {
						return res.sendStatus(400);
					}
					break;
				}
				case 'toDate': {
					if (queryNumberCheck(queryValue)) {
						DBquery += ` AND V.visited_at < ${queryValue}`;
					} else {
						return res.sendStatus(400);
					}
					break;
				}
				case 'fromAge': {
					//полученную таймстеп  - желаемая дата рождения оценивающего пользователя, ее надо сравнить с тем что в БД
					//Math.round(+new Date / 1000) - 31556952 * 2 /*года*/
					if (queryNumberCheck(queryValue)) {
						DBquery = `SELECT cast(ROUND(AVG(V.mark), 5) AS FLOAT) FROM "Visit" V LEFT OUTER JOIN "User" U ON V."user" = U.id WHERE U.birth_date > ${birthdayTimestamp(queryValue)}`;
					} else {
						return res.sendStatus(400);
					}
					break;
				}
				case 'toAge': {
					if (queryNumberCheck(queryValue)) {
						DBquery = `SELECT cast(ROUND(AVG(V.mark), 5) AS FLOAT) FROM "Visit" V LEFT OUTER JOIN "User" U ON V."user" = U.id WHERE U.birth_date < ${birthdayTimestamp(queryValue)}`;
					} else {
						return res.sendStatus(400);
					}
					break;
				}
				case 'gender': {
					DBquery = `SELECT cast(ROUND(AVG(V.mark), 5) AS FLOAT) FROM "Visit" V LEFT OUTER JOIN "User" U ON V."user" = U.id WHERE U.gender = '${queryValue}'`;
					//todo изменить проверку, не цифры а буквы должны быть в запросе
					if (queryNumberCheck(queryValue)) {
					} else {
						return res.sendStatus(400);
					}
					break;
				}

				/*case 'toDistance': {
					if (queryNumberCheck(queryValue)) {
						DBquery += ` AND L.distance < ${queryValue}`;
					} else {
						return res.sendStatus(400);
					}
					break;
				}
				case 'country': {
					if (/^[a-zA-Zа-яА-Я]+$/.test(queryValue)) {
						DBquery += ` AND L.country = '${queryValue}'`;
					} else {
						return res.sendStatus(400);
					}
				}*/
			}
		}
	}

	db
		.one(DBquery)
		.then(avgMark => {
			console.log(avgMark.round, "avgMark");
			//todo сделано ради удобства разработки, подумай что должно отправляться на самом деле
			res.sendStatus(200);
		}).catch(error => {
		console.log(error, 'не получилось вычислить среднюю оценку места');
		res.sendStatus(404);
	});
};