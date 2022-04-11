import Joi from "joi";
import { UserReqBody } from "../models";

/**
 * Validate signup details
 * @param data signup details
 * @returns error messages if any
 */
export const signupValidation = (data: Omit<UserReqBody, "_id">) =>
	Joi.object({
		email: Joi.string().required().min(6).max(256).email(),
		password: Joi.string().required().min(6).max(1024),
		name: Joi.string().max(256),
	}).validate(data)?.error?.details[0]?.message;
