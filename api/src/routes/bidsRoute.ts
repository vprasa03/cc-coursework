import { Router } from "express";

import { bidController } from "../controllers";
import { verifyToken } from "../middlewares";
import { Bid } from "../models";

/**
 * Route "/api/bids"
 */
class BidsRoute {
	private router = Router();

	constructor() {
		this.getBidsRoute();
	}

	/**
	 * GET "/:bids"
	 * Find bids given a json-stringified array of bid ids
	 */
	private getBidsRoute() {
		type ReqParams = {
			bids: string;
		};

		this.router.get<ReqParams>("/:bids", verifyToken, async (req, res) => {
			try {
				const bids = <Bid["_id"][]>JSON.parse(req.params.bids) || [];

				res.status(200).send(await bidController.getBids(bids));
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

export const bidsRoute = new BidsRoute();
