import Joi from "joi";

export const bidValidation = (data: any) =>
	Joi.object({
		amount: Joi.number().positive().required(),
	}).validate(data)?.error?.details[0].message;
