import { Router } from "express";

import {
	auctionController,
	bidController,
	userController,
} from "../controllers";
import { Bid } from "../models";
import { CreationType, unixTs } from "../utils";

/**
 * Route "/api/auction/:id/bid"
 */
class AuctionBidRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.postBid();
	}

	/**
	 * POST "/"
	 */
	private postBid() {
		type ReqBody = CreationType<Bid>;

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const bid = await bidController.createBid({
					createTime: unixTs(),
					forAuction: req.body.forAuction,
					byUser: req.body.byUser,
					amount: req.body.amount,
				});

				await auctionController.addAuctionBid(req.body.forAuction, bid._id);
				await userController.addAuctionBid(req.body.byUser, bid._id);
				res.send(bid);
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

export const auctionBidRoute = new AuctionBidRoute();
