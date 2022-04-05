/**
 * Check if provided date is today
 * @param dateStr a date in string representaion
 * @returns boolean
 */
export const isToday = (dateStr: string) => {
	const date = new Date();
	return (
		`${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, "0")}-${date.getFullYear()}` === dateStr
	);
};
