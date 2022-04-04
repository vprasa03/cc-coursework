import { Router } from "express";
import { userController } from "../controllers";
import { verifyToken } from "../middlewares";
import { User } from "../models";
import { userValidation } from "../validations";

/**
 * Route "/api/user"
 */
class UserRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.getUser();
		this.updateUser();
	}

	/**
	 * GET "/:id"
	 */
	private getUser() {
		type ReqParams = { id: User["_id"] };

		this.router.get<ReqParams>("/:id", verifyToken, async (req, res) => {
			try {
				const user = await userController.getUser(req.params.id);
				if (user) {
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
	 * PATCH "/"
	 */
	private updateUser() {
		type ReqBody = Partial<User>;

		this.router.patch<{}, {}, ReqBody>("/", verifyToken, async (req, res) => {
			try {
				const validationErr = userValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const userId = <User["_id"]>(<unknown>req.headers.user);
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
