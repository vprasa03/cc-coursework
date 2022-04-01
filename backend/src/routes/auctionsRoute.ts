import { Router } from "express";

import { auctionController } from "../controllers";

/**
 * Route "/api/auctions"
 */
class AuctionsRoute {
	private router = Router();

	constructor() {
		this.getAuctionsRoute();
	}

	/**
	 * GET "/"
	 */
	private getAuctionsRoute() {
		type ReqParams = {
			page: string;
			limit: string;
		};

		this.router.get<ReqParams>("/:page?/:limit?", async (req, res) => {
			try {
				const page = parseInt(req.params.page) || 0;
				const limit = parseInt(req.params.limit) || 0;

				res.send(await auctionController.getAuctions(page, limit));
			} catch (error: any) {
				res.send({ error: error.message });
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

export const auctionsRoute = new AuctionsRoute();
