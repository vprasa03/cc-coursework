import { Router } from "express";

import {
	auctionController,
	bidController,
	userController,
} from "../controllers";
import { Auction } from "../models";
import { CreationType, unixTs } from "../utils";
import { auctionBidRoute } from "./auctionBidRoute";
import { auctionItemRoute } from "./auctionItemRoute";
import { auctionParticipateRoute } from "./auctionParticipateRoute";

/**
 * Route "/api/auction"
 */
class AuctionRoute {
	private router = Router();

	constructor() {
		this.getAuctionRoute();
		this.createAuctionRoute();
		this.updateAuctionRoute();

		this.auctionItemRoutes();
		this.auctionBidRoutes();
		this.auctionParticipateRoutes();
	}

	/**
	 * GET "/:id"
	 */
	private getAuctionRoute() {
		type ReqParams = { id: Auction["_id"] };

		this.router.get<ReqParams>("/:id", async (req, res) => {
			try {
				const auction = await auctionController.getAuction(req.params.id);
				if (auction?.bids && auction?.participants) {
					const bids = await bidController.getBids(auction.bids);
					const participants = await userController.getUsers(
						auction.participants
					);
					res.send({ ...auction, bids, participants });
				} else {
					res.send(auction);
				}
			} catch (error: any) {
				res.send({ error: error.message });
			}
		});
	}

	/**
	 * POST "/"
	 */
	private createAuctionRoute() {
		type ReqBody = CreationType<Auction>;

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const auction = await auctionController.createAuction({
					createTime: unixTs(),
					by: req.body.by,
					item: req.body.item,
					startBid: req.body.startBid,
					endTime: req.body.endTime,
					status: "open",
				});
				res.send(auction);
			} catch (error: any) {
				res.send({ error: error.message });
			}
		});
	}

	/**
	 * PATCH "/:id"
	 */
	private updateAuctionRoute() {
		type ReqBody = Partial<Auction>;
		type ReqParams = { id: Auction["_id"] };

		this.router.patch<ReqParams, {}, ReqBody>("/", async (req, res) => {
			try {
				const auction = <Auction>await auctionController.updateAuction(
					req.params.id,
					{
						...(req.body.endTime ? { endTime: req.body.endTime } : {}),
						...(req.body.winner ? { winner: req.body.winner } : {}),
						...(req.body.status ? { status: req.body.status } : {}),
					}
				);
				res.send(auction);
			} catch (error: any) {
				res.send({ error: error.message });
			}
		});
	}

	/**
	 * Use "/:id/participate"
	 */
	private auctionParticipateRoutes() {
		this.router.use(
			"/:id/participate",
			(req, _res, next) => {
				req.body.forAuction = req.params.id;
				next();
			},
			auctionParticipateRoute.getRouter()
		);
	}

	/**
	 * Use "/:id/bid"
	 */
	private auctionBidRoutes() {
		this.router.use(
			"/:id/bid",
			(req, _res, next) => {
				req.body.forAuction = req.params.id;
				next();
			},
			auctionBidRoute.getRouter()
		);
	}

	/**
	 * Use "/item"
	 */
	private auctionItemRoutes() {
		this.router.use(
			"/item",
			(_req, _res, next) => {
				next();
			},
			auctionItemRoute.getRouter()
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

export const auctionRoute = new AuctionRoute();
