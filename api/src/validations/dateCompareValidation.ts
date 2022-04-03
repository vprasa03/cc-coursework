export const dateCompareValidation = (startDate: string, endDate: string) => {
	if (startDate > endDate) return "startDate > endDate";
	return undefined;
};
