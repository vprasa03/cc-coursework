import { Router } from "express";

import {
	auctionController,
	auctionItemController,
	bidController,
	userController,
} from "../controllers";
import { verifyToken } from "../middlewares";
import { Auction, User } from "../models";
import { AuctionStatus, EntryType, isToday, unixTs } from "../utils";
import { auctionValidation, dateCompareValidation } from "../validations";
import { auctionBidRoute } from "./auctionBidRoute";
import { auctionItemRoute } from "./auctionItemRoute";

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
	}

	/**
	 * GET "/:id"
	 */
	private getAuctionRoute() {
		type ReqParams = { id: Auction["_id"] };

		this.router.get<ReqParams>("/:id", async (req, res) => {
			try {
				const auction = await auctionController.getAuction(req.params.id);
				if (auction?.bids && auction?.bids.length > 0) {
					const bids = await bidController.getBids(auction.bids);
					res.status(400).send({ ...auction, bids });
				} else {
					res.status(200).send(auction);
				}
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * POST "/"
	 */
	private createAuctionRoute() {
		type ReqBody = EntryType<Auction>;

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				let validationErr = auctionValidation(req.body);
				if (validationErr) throw new Error(validationErr);
				validationErr = dateCompareValidation(
					req.body.startDate,
					req.body.endDate
				);
				if (validationErr) throw new Error(validationErr);

				const user = <User["_id"]>(<unknown>req.headers.user);
				if (
					user !==
					(await auctionItemController.getAuctionItem(req.body.item))?.ownedBy
				)
					throw new Error(
						`User ${req.body.by} does not own item ${req.body.item}`
					);

				const auction = await auctionController.createAuction({
					createTime: unixTs(),
					by: user,
					item: req.body.item,
					startBid: req.body.startBid,
					highestBid: -1,
					startDate: req.body.startDate,
					endDate: req.body.endDate,
					status: isToday(req.body.startDate)
						? AuctionStatus.open
						: AuctionStatus.entry,
				});
				await userController.addAuction(auction.by, auction._id);
				res.status(200).send(auction);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
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
				const user = <User["_id"]>(<unknown>req.headers.user);
				let auction = <Auction>(
					await auctionController.getAuction(req.params.id)
				);

				if (auction) {
					if (auction.by !== user)
						throw new Error("Auction not created by user");
					if (auction.status === AuctionStatus.closed)
						throw new Error("Auction is closed");
					if (
						auction.bids &&
						auction.bids.length > 0 &&
						auction.item !== req.body.item
					)
						throw new Error("Bids have been made. Cannot change item now.");

					let validationErr = auctionValidation(req.body);
					if (validationErr) throw new Error(validationErr);
					if (req.body.startDate && req.body.endDate)
						validationErr = dateCompareValidation(
							req.body.startDate,
							req.body.endDate
						);
					if (validationErr) throw new Error(validationErr);

					auction = <Auction>(
						await auctionController.updateAuction(req.params.id, req.body)
					);
					res.status(200).send(auction);
				} else throw new Error(`Auction ${req.params.id} does not exist`);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
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
			verifyToken,
			auctionBidRoute.getRouter()
		);
	}

	/**
	 * Use "/item"
	 */
	private auctionItemRoutes() {
		this.router.use("/item", verifyToken, auctionItemRoute.getRouter());
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
