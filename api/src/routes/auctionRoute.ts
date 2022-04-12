import { Router } from "express";
import { Types } from "mongoose";
import { auctionController, userController } from "../controllers";
import { verifyToken } from "../middlewares";
import { AuctionReqBody } from "../models";
import { AuctionStatus, isToday, unixTs } from "../utils";
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
		type ReqParams = { id: string };

		this.router.get<ReqParams>("/:id", verifyToken, async (req, res) => {
			try {
				const auction = await auctionController.getAuction(
					new Types.ObjectId(req.params.id)
				);
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
		type ReqBody = AuctionReqBody;

		this.router.post<{}, {}, ReqBody>("/", verifyToken, async (req, res) => {
			try {
				let validationErr = auctionValidation(req.body);
				if (validationErr) throw new Error(validationErr);
				validationErr = dateCompareValidation(
					req.body.startDate,
					req.body.endDate
				);
				if (validationErr) throw new Error(validationErr);

				const user = new Types.ObjectId(req.headers.user as string);
				const result = await auctionController.getActiveAuctionByItem(
					new Types.ObjectId(req.body.item)
				);

				if (result.length > 0) {
					const auction = result[0];
					if (!user.equals(auction.item[0].ownedBy))
						throw new Error(`User ${user} does not own item ${req.body.item}`);

					if (auction.status !== AuctionStatus.closed)
						throw new Error(
							`Another active auction exists for ${req.body.item}`
						);
				}

				const auction = await auctionController.createAuction({
					entryTime: unixTs(),
					by: user,
					item: new Types.ObjectId(req.body.item),
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
		type ReqParams = { id: string };

		this.router.patch<ReqParams>("/", verifyToken, async (req, res) => {
			try {
				const user = req.headers.user as string;
				let auction = await auctionController.getAuction(
					new Types.ObjectId(req.params.id)
				);
				if (auction.length !== 0) {
					if (!auction[0].by._id.equals(user))
						throw new Error("Auction not created by user");
					if (auction[0].status === AuctionStatus.closed)
						throw new Error("Auction is closed");
					if (
						auction[0].bids &&
						auction[0].bids.length > 0 &&
						auction[0].item[0]._id.equals(req.body.item)
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

					await auctionController.updateAuction(
						new Types.ObjectId(req.params.id),
						req.body
					);
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
		type ReqParams = { id: string };

		this.router.delete<ReqParams>("/", verifyToken, async (req, res) => {
			try {
				const user = req.headers.user as string;
				let auction = await auctionController.getAuction(
					new Types.ObjectId(req.params.id)
				);
				if (auction.length !== 0) {
					if (!auction[0].by._id.equals(user))
						throw new Error("Auction not created by user");
					if (auction[0].status === AuctionStatus.closed)
						throw new Error("Auction is closed");
					if (
						auction[0].bids &&
						auction[0].bids.length > 0 &&
						auction[0].item[0]._id.equals(req.body.item)
					)
						throw new Error("Bids have been made. Cannot delete auction now.");

					res
						.status(200)
						.send(
							await auctionController.deleteAuction(
								new Types.ObjectId(req.params.id)
							)
						);
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
