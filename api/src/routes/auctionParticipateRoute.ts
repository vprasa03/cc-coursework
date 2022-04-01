import { Router } from "express";

import { auctionController, userController } from "../controllers";
import { Auction, User } from "../models";

/**
 * Route "/api/auction/:id/participate"
 */
class AuctionParticipateRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.postParticipate();
	}

	/**
	 * POST "/"
	 */
	private postParticipate() {
		type ReqBody = {
			userId: User["_id"];
			forAuction: Auction["_id"];
		};

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				await auctionController.addAuctionParticipant(
					req.body.forAuction,
					req.body.userId
				);
				const user = <User>(
					await userController.beAuctionParticipant(
						req.body.userId,
						req.body.forAuction
					)
				);
				if (!user?.auctions?.includes(req.body.forAuction)) {
					user?.auctions?.push(req.body.forAuction);
				}
				res.send(user);
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

export const auctionParticipateRoute = new AuctionParticipateRoute();
