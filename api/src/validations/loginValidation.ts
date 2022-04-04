import Joi from "joi";
import { User } from "../models";
import { EntryType } from "../utils";

/**
 * Validate login details
 * @param data login details
 * @returns error messages if any
 */
export const loginValidation = (data: EntryType<User>) =>
	Joi.object({
		email: Joi.string().required().min(6).max(256).email(),
		password: Joi.string().required().min(6).max(1024),
	}).validate(data)?.error?.details[0]?.message;
