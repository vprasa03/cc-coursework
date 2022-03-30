import { Router } from "express";

/**
 * Route "/user"
 * @public
 */
class UserRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.getUser();
	}

	/**
	 * GET "/"
	 */
	private getUser() {
		this.router.get("/", (_req, res) => {
			res.send("Home page!");
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
