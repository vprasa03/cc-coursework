import { Router } from "express";
import { Types } from "mongoose";
import { userController } from "../controllers";
import { verifyToken } from "../middlewares";
import { UserReqBody } from "../models";
import { userValidation } from "../validations";

/**
 * Route "/api/user"
 */
class UserRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.getUser();
		this.getUserWithEmail();
		this.updateUser();
	}

	/**
	 * GET "/:id"
	 * Find user with given id
	 */
	private getUser() {
		type ReqParams = { id: string };

		this.router.get<ReqParams>("/:id", verifyToken, async (req, res) => {
			try {
				const result = await userController.getUser(
					new Types.ObjectId(req.params.id)
				);
				if (result.length > 0) {
					const user = result[0];

					res.status(200).send({
						_id: user._id,
						email: user.email,
						name: user.name,
						auctions: user.auctions,
						bids: user.bids,
					});
				} else throw new Error(`User ${req.params.id} does not exist`);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * GET "/email/:email"
	 * Find user with given email
	 */
	private getUserWithEmail() {
		type ReqParams = { email: string };

		this.router.get<ReqParams>(
			"/email/:email",
			verifyToken,
			async (req, res) => {
				try {
					const result = await userController.getUserWithEmail(
						req.params.email
					);

					if (result.length > 0) {
						const user = result[0];

						res.status(200).send({
							_id: user._id,
							email: user.email,
							name: user.name,
							auctions: user.auctions,
							bids: user.bids,
						});
					} else throw new Error(`User ${req.params.email} does not exist`);
				} catch (error: any) {
					res.status(400).send({ error: error.message });
				}
			}
		);
	}

	/**
	 * PATCH "/"
	 * Update authenticated user's details
	 */
	private updateUser() {
		type ReqBody = UserReqBody;

		this.router.patch<{}, {}, ReqBody>("/", verifyToken, async (req, res) => {
			try {
				const validationErr = userValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const userId = new Types.ObjectId(req.headers.user as string);
				const user = await userController.getUser(userId);
				if (user) {
					await userController.updateUser(userId, req.body);
				} else throw new Error(`User ${userId} does not exist`);
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

export const userRoute = new UserRoute();
