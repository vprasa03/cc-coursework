import Joi from "joi";

/**
 * Validate a bid
 * @param data the bid data
 * @returns error messages if any
 */
export const bidValidation = (data: any) =>
	Joi.object({
		amount: Joi.number().positive().required(),
	}).validate(data)?.error?.details[0].message;
