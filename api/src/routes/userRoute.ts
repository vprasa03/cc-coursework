import { Router } from "express";
import { verifyToken } from "../middlewares";

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
		this.router.get("/:id", (_req, res) => {
			res.status(200).send("Home page!");
		});
	}

	/**
	 * PATCH "/"
	 */
	private updateUser() {
		this.router.patch("/", verifyToken, (_req, res) => {
			res.status(200).send("Home page!");
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
