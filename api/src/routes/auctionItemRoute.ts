import { Router } from "express";

import { auctionItemController } from "../controllers";
import { AuctionItem, User } from "../models";
import { EntryType, unixTs } from "../utils";
import { auctionItemValidation } from "../validations";

/**
 * Route "/api/auction/item"
 */
class AuctionItemRoute {
	private router = Router();

	constructor() {
		this.getAuctionItemRoute();
		this.createAuctionItemRoute();
		this.updateAuctionItemRoute();
	}

	/**
	 * POST "/"
	 */
	private createAuctionItemRoute() {
		type ReqBody = EntryType<AuctionItem>;

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const user = <User["_id"]>(<unknown>req.headers.user);
				const validationErr = auctionItemValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const auctionItem = await auctionItemController.createAuctionItem({
					createTime: unixTs(),
					ownedBy: user,
					name: req.body.name,
					details: req.body.details,
					condition: req.body.condition,
				});
				res.status(200).send(auctionItem);
			} catch (error: any) {
				console.log(req.params, req.headers, req.body);
				console.log(error);

				res.status(400).send({ error: error.message });
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
				res.status(200).send(auctionItem);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * PATCH "/:id"
	 */
	private updateAuctionItemRoute() {
		type ReqParams = { id: AuctionItem["_id"] };
		type ReqBody = Partial<AuctionItem>;

		this.router.patch<ReqParams, {}, ReqBody>("/:id", async (req, res) => {
			try {
				const user = <User["_id"]>(<unknown>req.headers.user);
				const validationErr = auctionItemValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				let auctionItem = await auctionItemController.getAuctionItem(
					req.params.id
				);
				if (auctionItem) {
					if (auctionItem.ownedBy !== user)
						throw new Error(`${user} does not own item ${req.params.id}`);
					await auctionItemController.updateAuctionItem(
						req.params.id,
						req.body
					);
					res.status(200).send({ ...auctionItem, ...req.body });
				} else throw new Error(`Item ${req.params.id} does not exist`);
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

export const auctionItemRoute = new AuctionItemRoute();
