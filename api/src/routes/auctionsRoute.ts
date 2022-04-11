import { Router } from "express";

import { auctionController } from "../controllers";
import { verifyToken } from "../middlewares";

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
	 * Get paginated list of auctions sorted in descending order by endDate
	 */
	private getAuctionsRoute() {
		type ReqParams = {
			page: string;
			limit: string;
		};

		this.router.get<ReqParams>(
			"/:page?/:limit?",
			verifyToken,
			async (req, res) => {
				try {
					const page = parseInt(req.params.page) || 0;
					const limit = parseInt(req.params.limit) || 1000;

					res
						.status(200)
						.send(await auctionController.getAuctions(page, limit));
				} catch (error: any) {
					res.status(400).send({ error: error.message });
				}
			}
		);
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
