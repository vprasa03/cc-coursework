import Joi from "joi";
import { UserReqBody } from "../models";

/**
 * Validate login details
 * @param data login details
 * @returns error messages if any
 */
export const loginValidation = (
	data: Pick<UserReqBody, "email" | "password">
) =>
	Joi.object({
		email: Joi.string().required().min(6).max(256).email(),
		password: Joi.string().required().min(6).max(1024),
	}).validate(data)?.error?.details[0]?.message;
