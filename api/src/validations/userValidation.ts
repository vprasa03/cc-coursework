import Joi from "joi";
import { User } from "../models";

/**
 * Validate user details
 * @param data user details
 * @returns error messages if any
 */
export const userValidation = (data: Partial<User>) =>
	Joi.object({
		email: Joi.string().required().min(6).max(256).email(),
		name: Joi.string().max(256),
	}).validate(data)?.error?.details[0]?.message;
