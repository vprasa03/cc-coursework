import Joi from "joi";

import { User } from "../models";
import { EntryType } from "../utils";

export const signupValidation = (data: EntryType<User>) =>
	Joi.object({
		email: Joi.string().required().min(6).max(256).email(),
		password: Joi.string().required().min(6).max(1024),
		name: Joi.string().max(256),
	}).validate(data)?.error?.details[0]?.message;
