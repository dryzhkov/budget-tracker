export function dateToString(date: Date, options: Intl.DateTimeFormatOptions = {}) {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		timeZone: 'UTC',
		...options
	});
}

export function stringToDate(date: string) {
	return new Date(date);
}

export function getYear(date?: Date) {
	return (date ?? new Date()).getFullYear();
}

export function formatDate(backendDate: string, options: Intl.DateTimeFormatOptions = {}) {
	return dateToString(stringToDate(backendDate), options);
}

export function getYears() {
	const startingYear = 2018;
	const years = [startingYear];
	for (let i = startingYear + 1; i <= getYear(); i++) {
		years.unshift(i);
	}
	return years;
}
