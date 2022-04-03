import Joi from "joi";
import { ItemCondition } from "../utils";

export const auctionItemValidation = (data: any) =>
	Joi.object({
		name: Joi.string().max(256).required(),
		details: Joi.string().max(1024).required(),
		condition: Joi.string()
			.valid(ItemCondition.new, ItemCondition.used)
			.required(),
	}).validate(data)?.error?.details[0].message;
