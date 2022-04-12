import { Router } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { unixTs } from "../utils";
import { UserReqBody } from "../models";
import { loginValidation, signupValidation } from "../validations";
import { userController } from "../controllers";

/**
 * Route "/api/auth"
 */
class AuthRoute {
	private saltKey = 5;
	private router: Router;

	constructor() {
		this.router = Router();

		this.postSignup();
		this.postLogin();
		this.postResetPass();
	}

	/**
	 * POST "/signup"
	 * Signup for new users
	 */
	private postSignup() {
		type ReqBody = UserReqBody;

		this.router.post<{}, {}, ReqBody>("/signup", async (req, res) => {
			try {
				const validationErr = signupValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const result = await userController.getUserWithEmail(req.body.email);
				if (result.length > 0)
					throw new Error(`${req.body.email} already exists`);

				const salt = await genSalt(this.saltKey);
				const hashed = await hash(req.body.password, salt);

				const user = await userController.createUser({
					...req.body,
					password: hashed,
					entryTime: unixTs(),
				});
				res.status(200).send({
					_id: user._id,
					email: user.email,
					name: user.name,
				});
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * POST "/reset-pass"
	 * Password reset for existing users
	 */
	private postResetPass() {
		type ReqBody = UserReqBody;

		this.router.post<{}, {}, ReqBody>("/reset-pass", async (req, res) => {
			try {
				const validationErr = signupValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const result = await userController.getUserWithEmail(req.body.email);
				if (result.length === 0)
					throw new Error(`${req.body.email} does not exist`);

				const user = result[0];
				const salt = await genSalt(this.saltKey);
				const hashed = await hash(req.body.password, salt);

				await userController.updateUser(user._id, {
					password: hashed,
				});
				res.status(200).send({ success: true });
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * POST "/login"
	 * Login for existing users
	 */
	private postLogin() {
		type ReqBody = UserReqBody;

		this.router.post<{}, {}, ReqBody>("/login", async (req, res) => {
			try {
				const validationErr = loginValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const result = await userController.getUserWithEmail(req.body.email);
				if (result.length === 0)
					throw new Error(`${req.body.email} does not exist`);

				const user = result[0];
				const passwordValid = await compare(req.body.password, user.password);
				if (!passwordValid) throw new Error("Password is wrong");

				if (process.env.TOKEN_SECRET) {
					const token = sign({ id: user._id }, process.env.TOKEN_SECRET);

					res
						.status(200)
						.header("auth-token", token)
						.send({ "auth-token": token });
				} else throw new Error("Server error: Secret missing");
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * Getter for router
	 * @returns Router object
	 */
	public getRouter() {
		return this.router;
	}
}

export const authRoute = new AuthRoute();
