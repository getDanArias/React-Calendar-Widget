exports.getMonthName = (monthNumber) => {
	const monthNames = [
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	];
	
	return monthNames[monthNumber];
};

exports.getDaysOfWeek = () => {
	return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

exports.getDaysOfWeekShort = () => {
	return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
};


