import { Router } from "express";
import { genSalt, hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { EntryType, unixTs } from "../utils";
import { User } from "../models";
import { signupValidation } from "../validations";
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
	 */
	private postSignup() {
		type ReqBody = EntryType<User>;

		this.router.post<{}, {}, ReqBody>("/signup", async (req, res) => {
			try {
				const validationErr = signupValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				if (await userController.getUserWithEmail(req.body.email))
					throw new Error(`${req.body.email} already exists`);

				const salt = await genSalt(this.saltKey);
				const hashed = await hash(req.body.password, salt);

				const user = await userController.createUser({
					...req.body,
					password: hashed,
					entryTime: unixTs(),
				});
				res.status(200).send(user);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * POST "/reset-pass"
	 */
	private postResetPass() {
		type ReqBody = EntryType<User>;

		this.router.post<{}, {}, ReqBody>("/reset-pass", async (req, res) => {
			try {
				const validationErr = signupValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const user = await userController.getUserWithEmail(req.body.email);
				if (!user) throw new Error(`${req.body.email} does not exist`);

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
	 */
	private postLogin() {
		type ReqBody = EntryType<User>;

		this.router.post<{}, {}, ReqBody>("/login", async (req, res) => {
			try {
				const validationErr = signupValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const user = await userController.getUserWithEmail(req.body.email);
				if (!user) throw new Error(`${req.body.email} does not exist`);

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
