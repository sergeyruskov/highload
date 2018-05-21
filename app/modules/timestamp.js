function birthdayTimestamp(year) {
	const date = new Date;
	const currDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
	const birthDayTimestamp = currDate.setFullYear(currDate.getFullYear() - year).valueOf();
	return Math.round(birthDayTimestamp / 1000);
}

module.exports = {
	birthdayTimestamp
};