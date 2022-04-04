/**
 * Checks that startDate does not come after endDate
 * @param startDate
 * @param endDate
 * @returns error message if startDate < endDate, otherwise nothing
 */
export const dateCompareValidation = (startDate: string, endDate: string) => {
	if (startDate > endDate) return "startDate > endDate";
	return undefined;
};
