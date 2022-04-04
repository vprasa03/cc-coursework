/**
 * Check if provided date is today
 * @param dateStr a date in string representaion
 * @returns boolean
 */
export const isToday = (dateStr: string) => {
	const date = new Date();
	return (
		`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` === dateStr
	);
};
