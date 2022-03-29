import { Router } from "express";

/**
 * Root route ("/")
 * @public
 */
class RootRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.getRoot();
	}

	/**
	 * Enable GET on '/' route
	 */
	private getRoot() {
		this.router.get("/", (_req, res) => {
			res.send("Home page!");
		});
	}

	/**
	 * Get bids router
	 * @returns Router object
	 */
	public getRouter() {
		return this.router;
	}
}

export const rootRoute = new RootRoute();
