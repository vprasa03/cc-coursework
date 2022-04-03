import Joi from "joi";
const dateFormat = "DD-MM-YYYY";
const dateFormatErrMsg = (key: string, format: string) =>
	`${key} must have format ${format}`;
const invalidMsg = (key1: string, key2: string, val: number) =>
	`${val} is invalid ${key2} for ${key1}`;
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

export const auctionValidation = (data: any) =>
	Joi.object({
		startBid: Joi.number().positive().required(),
		startDate: Joi.string().custom(customDateValidator("startDate")).required(),
		endDate: Joi.string().custom(customDateValidator("endDate")).required(),
		item: Joi.string().length(24).required(),
	}).validate(data)?.error?.details[0].message;
