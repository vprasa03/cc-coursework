import { Router } from "express";
import { Types } from "mongoose";
import {
	auctionController,
	bidController,
	userController,
} from "../controllers";
import { Auction, Bid } from "../models";
import { AuctionStatus, unixTs } from "../utils";
import { bidValidation } from "../validations";

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
	 * Make a bid in an auction
	 */
	private postBid() {
		type ReqBody = { amount: Bid["amount"]; forAuction: Auction["_id"] };

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const validationErr = bidValidation({ amount: req.body.amount });
				if (validationErr) throw new Error(validationErr);

				const user = <string>req.headers.user;
				const auction = await auctionController.getAuction(req.body.forAuction);
				if (auction.status !== AuctionStatus.open)
					throw new Error("Not open for bidding");
				if (auction.highestBid) {
					const highestBid = await bidController.getBids([auction.highestBid]);
					if (req.body.amount <= highestBid[0]?.amount)
						throw new Error("Insufficient amount");
				}

				const bid = await bidController.createBid({
					entryTime: unixTs(),
					forAuction: req.body.forAuction,
					byUser: user,
					amount: req.body.amount,
				});

				await auctionController.addAuctionBid(req.body.forAuction, bid);
				await userController.addAuctionBid(new Types.ObjectId(user), bid._id);
				res.status(200).send(bid);
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

export const auctionBidRoute = new AuctionBidRoute();
