import Joi from "joi";
import { BidReqBody } from "../models";

/**
 * Validate a bid
 * @param data the bid data
 * @returns error messages if any
 */
export const bidValidation = (data: BidReqBody) =>
	Joi.object({
		amount: Joi.number().positive().required(),
	}).validate(data)?.error?.details[0].message;
