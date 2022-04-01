import { Router } from "express";

import { auctionItemController } from "../controllers";
import { AuctionItem } from "../models";
import { CreationType, unixTs } from "../utils";

/**
 * Route "/api/auction/item"
 */
class AuctionItemRoute {
	private router = Router();

	constructor() {
		this.getAuctionItemRoute();
		this.createAuctionItemRoute();
		this.patchAuctionItemRoute();
	}

	/**
	 * POST "/"
	 */
	private createAuctionItemRoute() {
		type ReqBody = CreationType<AuctionItem>;

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const auctionItem = await auctionItemController.createAuctionItem({
					createTime: unixTs(),
					name: req.body.name,
					details: req.body.details,
					condition: req.body.condition,
				});
				res.send(auctionItem);
			} catch (error: any) {
				res.send({ error: error.message });
			}
		});
	}

	/**
	 * GET "/:id"
	 */
	private getAuctionItemRoute() {
		type ReqParams = { id: AuctionItem["_id"] };

		this.router.get<ReqParams>("/:id", async (req, res) => {
			try {
				const auctionItem = await auctionItemController.getAuctionItem(
					req.params.id
				);
				res.send(auctionItem);
			} catch (error: any) {
				res.send({ error: error.message });
			}
		});
	}

	/**
	 * PATCH "/:id"
	 */
	private patchAuctionItemRoute() {
		type ReqParams = { id: AuctionItem["_id"] };
		type ReqBody = Partial<AuctionItem>;

		this.router.patch<ReqParams, {}, ReqBody>("/:id", async (req, res) => {
			try {
				const auctionItem = <AuctionItem>(
					await auctionItemController.updateAuctionItem(req.params.id, {
						...(req.body.name ? { name: req.body.name } : {}),
						...(req.body.details ? { details: req.body.details } : {}),
						...(req.body.condition ? { condition: req.body.condition } : {}),
					})
				);
				res.send(auctionItem);
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

export const auctionItemRoute = new AuctionItemRoute();
