import { Router } from "express";

import { AuctionController, AuctionItemController } from "../controllers";
import { Auction, AuctionItem } from "../models";
import { CreationType, unixTs } from "../utils";

/**
 * Route "/auctions"
 * @public
 */
class AuctionsRoute {
	private router: Router;

	constructor() {
		this.router = Router();

		this.getAuctionsRoute();
		this.getAuctionRoute();
		this.createAuctionRoute();
	}

	/**
	 * GET "/"
	 */
	private getAuctionsRoute() {
		this.router.get("/", async (_req, res) => {
			try {
				res.send(await AuctionController.getAuctions());
			} catch (error) {
				res.send({ error });
			}
		});
	}

	/**
	 * GET "/:id"
	 */
	private getAuctionRoute() {
		this.router.get<{ id: Auction["_id"] }>("/:id", async (req, res) => {
			try {
				const id = req.params.id;
				res.send(await AuctionController.getAuction(id));
			} catch (error) {
				res.send({ error });
			}
		});
	}

	/**
	 * POST "/create"
	 */
	private createAuctionRoute() {
		this.router.post(
			"/create",
			async (
				req: {
					body: CreationType<Auction> & {
						item: CreationType<AuctionItem>;
					};
				},
				res
			) => {
				try {
					const newItem = await AuctionItemController.createAuctionItem({
						details: req.body.item.details,
						name: req.body.item.name,
						condition: req.body.item.condition,
						createTime: unixTs(),
					});

					const newAuction = await AuctionController.createAuction({
						createTime: unixTs(),
						by: req.body.by,
						item: newItem._id,
						startBid: req.body.startBid,
						endTime: req.body.endTime,
						status: "open",
					});

					res.send({ ...newAuction, item: newItem });
				} catch (error) {
					res.send({ error });
				}
			}
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

export const auctionsRoute = new AuctionsRoute();
