module.exports = function getUserVisits({db, res, id, query}) {
	let DBquery = `SELECT V.visited_at, V.mark, L.place FROM Visit V, Location L WHERE V.user = ${id} AND V.location = L.id`;
	// let DBquery = `SELECT V.visited_at, V.mark, L.place FROM "Visit" V LEFT OUTER JOIN "Location" L ON V.location = L.id WHERE V.user = ${id}`;
	function queryNumberCheck(query) {
		return /^\d+$/.test(query);
	}
	for(let queryKey in query) {
		if (query.hasOwnProperty(queryKey)) {
			const queryValue = query[queryKey];
			switch(queryKey) {
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
				case 'toDistance': {
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
				}
			}
		}
	}
    console.log(DBquery);
    db.query(DBquery, function (error, data) {
	    console.log(data);
	    // if (error) {
        //     console.log(data, 'ошибка при запросе пользователя');
        //     return res.sendStatus(404);
        // }
        // console.log(data, 'data');
        if (data[0]) {
            //todo возможно стоит заменить на res.sendStatus(200);
            res.statusCode = 200;
            return console.log(
	            JSON.stringify(data[0].place.data.toString('utf8'))/*, data[0].place.toString('utf8')*/);
            return res.json({})
        }
        return res.sendStatus(404);


        //todo вынести логику из chain метода в callback
        // .then(visits => {
        //     function sortByVisitedTime(visits) {
        //         return visits.sort((a, b) => a.visited_at - b.visited_at);
        //     }
        //     res.send({visits: sortByVisitedTime(visits)});
        // }).catch(error => {
        //     console.log(error, 'не получилось найти данные по визитам пользователя');
        //     res.sendStatus(404);
        // });
    })
};
