import { Router } from "express";
import {
	auctionController,
	auctionItemController,
	userController,
} from "../controllers";
import { verifyToken } from "../middlewares";
import { Auction } from "../models";
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
		this.deleteAuctionRoute();

		this.auctionItemRoutes();
		this.auctionBidRoutes();
	}

	/**
	 * GET "/:id"
	 * Find an auction with given id
	 */
	private getAuctionRoute() {
		type ReqParams = { id: Auction["_id"] };

		this.router.get<ReqParams>("/:id", verifyToken, async (req, res) => {
			try {
				const auction = await auctionController.getAuction(req.params.id);
				res.status(200).send(auction);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * POST "/"
	 * Create a new auction
	 */
	private createAuctionRoute() {
		type ReqBody = EntryType<Auction>;

		this.router.post<{}, {}, ReqBody>("/", verifyToken, async (req, res) => {
			try {
				let validationErr = auctionValidation(req.body);
				if (validationErr) throw new Error(validationErr);
				validationErr = dateCompareValidation(
					req.body.startDate,
					req.body.endDate
				);
				if (validationErr) throw new Error(validationErr);

				const user = <string>req.headers.user;
				const item = await auctionItemController.getAuctionItem(req.body.item);
				if (!item?.ownedBy.equals(user))
					throw new Error(`User ${user} does not own item ${req.body.item}`);
				const auctionExists = await auctionController.getActiveAuctionByItem(
					req.body.item
				);
				if (auctionExists && auctionExists.status !== AuctionStatus.closed)
					throw new Error(`Another active auction exists for ${req.body.item}`);
				const auction = await auctionController.createAuction({
					entryTime: unixTs(),
					by: user,
					item: req.body.item,
					startBid: req.body.startBid,
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
	 * Update an existing auction
	 */
	private updateAuctionRoute() {
		type ReqParams = { id: Auction["_id"] };

		this.router.patch<ReqParams>("/", verifyToken, async (req, res) => {
			try {
				const user = <string>req.headers.user;
				let auction = await auctionController.getAuction(req.params.id);
				if (auction) {
					if (!auction.by.equals(user))
						throw new Error("Auction not created by user");
					if (auction.status === AuctionStatus.closed)
						throw new Error("Auction is closed");
					if (
						auction.bids &&
						auction.bids.length > 0 &&
						auction.item !== req.body.item
					)
						throw new Error("Bids have been made. Cannot change auction now.");

					let validationErr = auctionValidation(req.body);
					if (validationErr) throw new Error(validationErr);
					if (req.body.startDate && req.body.endDate)
						validationErr = dateCompareValidation(
							req.body.startDate,
							req.body.endDate
						);
					if (validationErr) throw new Error(validationErr);

					await auctionController.updateAuction(req.params.id, req.body);
					res.status(200).send({ ...auction, ...req.body });
				} else throw new Error(`Auction ${req.params.id} does not exist`);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * DELETE "/:id"
	 * Update an existing auction
	 */
	private deleteAuctionRoute() {
		type ReqParams = { id: Auction["_id"] };

		this.router.delete<ReqParams>("/", verifyToken, async (req, res) => {
			try {
				const user = <string>req.headers.user;
				let auction = await auctionController.getAuction(req.params.id);
				if (auction) {
					if (!auction.by.equals(user))
						throw new Error("Auction not created by user");
					if (auction.status === AuctionStatus.closed)
						throw new Error("Auction is closed");
					if (
						auction.bids &&
						auction.bids.length > 0 &&
						auction.item !== req.body.item
					)
						throw new Error("Bids have been made. Cannot delete auction now.");

					auction = await auctionController.deleteAuction(req.params.id);
					res.status(200).send(auction);
				} else throw new Error(`Auction ${req.params.id} does not exist`);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * Use "/:id/bid"
	 * Attach router for bidding on a given auction
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
	 * Attach router for auction items
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
