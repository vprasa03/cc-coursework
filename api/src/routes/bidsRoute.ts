import { Router } from "express";
import { Types } from "mongoose";
import { bidController } from "../controllers";
import { verifyToken } from "../middlewares";

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
	 * Find bids given comma separated list of bid ids
	 */
	private getBidsRoute() {
		type ReqParams = {
			bids: string;
		};

		this.router.get<ReqParams>("/:bids", verifyToken, async (req, res) => {
			try {
				const bids =
					req.params.bids.split(",").map((str) => new Types.ObjectId(str)) ||
					[];

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
