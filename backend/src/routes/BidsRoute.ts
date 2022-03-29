import { Router } from "express";

/**
 * Bids route ("/bids/")
 * @public
 */
class BidsRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.getHome();
	}

	/**
	 * GET "/bids"
	 */
	private getHome() {
		this.router.get("/", (_req, res) => {
			res.send("Bids!");
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

export const bidsRoute = new BidsRoute();
