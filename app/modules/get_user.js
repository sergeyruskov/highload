module.exports = function getUsers({db, id, res}) {
	//todo возможно query заменить на что-то типа many
	db.query(`SELECT
	id,
	first_name,
	last_name,
	gender,
	-UNIX_TIMESTAMP(birth_date) as birth_date,
	email
	FROM user WHERE id=${id}`, function (error, data) {
        if (error) {
            console.log(data, 'ошибка при запросе пользователя');
            return res.sendStatus(404);
        }
        if (data[0]) {
            //todo возможно стоит заменить на res.sendStatus(200);
            res.statusCode = 200;
            return res.json(data[0]);
        }
        return res.sendStatus(404);
    });
};