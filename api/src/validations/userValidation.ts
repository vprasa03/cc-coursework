import Joi from "joi";
import { UserReqBody } from "../models";

/**
 * Validate user details
 * @param data user details
 * @returns error messages if any
 */
export const userValidation = (data: Pick<UserReqBody, "email" | "name">) =>
	Joi.object({
		email: Joi.string().min(6).max(256).email(),
		name: Joi.string().max(256),
	}).validate(data)?.error?.details[0]?.message;
