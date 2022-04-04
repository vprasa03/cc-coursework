import Joi from "joi";

const dateFormat = "DD-MM-YYYY"; // The accepted date format

/**
 * Get error message for incorrect date format
 * @param key startDate OR endDate
 * @param format The date format
 * @returns formatted error message
 */
const dateFormatErrMsg = (key: string, format: string) =>
	`${key} must have format ${format}`;

/**
 * Get error message for invalid dates
 * @param key1 startDate OR endDate
 * @param key2 year, month OR date
 * @param val value of year, month OR date
 * @returns formatted error message
 */
const invalidMsg = (key1: string, key2: string, val: number) =>
	`${val} is invalid ${key2} for ${key1}`;

/**
 * Custom validator for checking startDate and endDate
 * @param key startDate OR endDate
 * @returns the date unless an error is thrown
 */
const customDateValidator = (key: string) => (dateString: string) => {
	const [d, m, y] = dateString.split("-").map(parseInt);
	if (
		dateString.length !== 10 ||
		d === undefined ||
		m === undefined ||
		y === undefined
	)
		throw new Error(dateFormatErrMsg(key, dateFormat));

	const date = new Date();
	if (y < date.getFullYear() || y > 9999)
		throw new Error(invalidMsg(key, "year", y));
	date.setFullYear(y);
	date.setMonth(m - 1);
	if (m - 1 !== date.getMonth()) throw new Error(invalidMsg(key, "month", m));
	date.setDate(d);
	if (d !== date.getDate())
		throw new Error(invalidMsg(`month ${m} of ${key}`, "date", d));

	return dateString;
};

/**
 * Validate data for an auction
 * @param data the auction
 * @returns error messages if any
 */
export const auctionValidation = (data: any) =>
	Joi.object({
		startBid: Joi.number().positive().required(),
		startDate: Joi.string().custom(customDateValidator("startDate")).required(),
		endDate: Joi.string().custom(customDateValidator("endDate")).required(),
		item: Joi.string().length(24).required(),
	}).validate(data)?.error?.details[0].message;
