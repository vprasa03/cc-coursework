import { Router } from "express";

import { auctionController, auctionItemController } from "../controllers";
import { Auction, AuctionItem } from "../models";
import { CreationType, unixTs } from "../utils";

/**
 * Route "/auction"
 */
class AuctionRoute {
	private router = Router();

	constructor() {
		this.getAuctionRoute();
		this.createAuctionRoute();
	}

	/**
	 * GET "/:id"
	 */
	private getAuctionRoute() {
		type ReqParams = { id: Auction["_id"] };

		this.router.get<ReqParams>("/auction/:id", async (req, res) => {
			try {
				const id = req.params.id;
				res.send(await auctionController.getAuction(id));
			} catch (error) {
				res.send({ error });
			}
		});
	}

	/**
	 * POST "/create"
	 */
	private createAuctionRoute() {
		type ReqBody = CreationType<Auction> & { item: AuctionItem };

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				let item;
				if (req.body.item._id === undefined) {
					item = <AuctionItem>await auctionItemController.createAuctionItem({
						details: req.body.item.details,
						name: req.body.item.name,
						condition: req.body.item.condition,
						createTime: unixTs(),
					});
				} else {
					item = <AuctionItem>(
						await auctionItemController.getAuctionItem(req.body.item._id)
					);
				}

				const newAuction = await auctionController.createAuction({
					createTime: unixTs(),
					by: req.body.by,
					item: item._id,
					startBid: req.body.startBid,
					endTime: req.body.endTime,
					status: "open",
				});

				res.send({ ...newAuction, item });
			} catch (error) {
				res.send({ error });
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

export const auctionRoute = new AuctionRoute();
