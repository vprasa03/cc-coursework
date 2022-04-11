import Joi from "joi";
import { AuctionItemReqBody } from "../models";
import { ItemCondition } from "../utils";

/**
 * Validate an auction item
 * @param data the auction item
 * @returns error messages if any
 */
export const auctionItemValidation = (data: AuctionItemReqBody) =>
	Joi.object({
		name: Joi.string().max(256).required(),
		details: Joi.string().max(1024).required(),
		condition: Joi.string()
			.valid(ItemCondition.new, ItemCondition.used)
			.required(),
	}).validate(data)?.error?.details[0].message;
