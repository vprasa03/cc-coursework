import { Router } from "express";
import { Types } from "mongoose";
import {
	auctionController,
	bidController,
	userController,
} from "../controllers";
import { BidReqBody } from "../models";
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
		type ReqBody = BidReqBody & { forAuction: string };

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const validationErr = bidValidation({ amount: req.body.amount });
				if (validationErr) throw new Error(validationErr);

				const user = new Types.ObjectId(req.headers.user as string);

				// Find auction to bid on
				const auctionExists = await auctionController.getAuction(
					new Types.ObjectId(req.body.forAuction)
				);

				// Check auction exists
				if (auctionExists.length === 0)
					throw new Error("Auction does not exist");

				const auction = auctionExists[0];

				// Check bidder is not auction creator
				if (auction.by.equals(user))
					throw new Error("Cannot bid on own auction");

				// Check if auction is open for bidding
				if (auction.status !== AuctionStatus.open)
					throw new Error("Not open for bidding");

				// Check bid amount
				if (req.body.amount < auction.startBid)
					throw new Error("Insufficient amount");
				if (auction.highestBid?.[0]) {
					if (req.body.amount <= auction.highestBid[0].amount)
						throw new Error("Insufficient amount");
				}

				const bid = await bidController.createBid({
					entryTime: unixTs(),
					forAuction: new Types.ObjectId(req.body.forAuction),
					byUser: user,
					amount: req.body.amount,
				});

				// Add bid to relevant auction
				await auctionController.addAuctionBid(
					new Types.ObjectId(req.body.forAuction),
					bid
				);

				// Add bid to corresponding user in user collection
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
