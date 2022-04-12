import { Router } from "express";
import { Types } from "mongoose";
import { auctionController, auctionItemController } from "../controllers";
import { AuctionItemReqBody } from "../models";
import { AuctionStatus, unixTs } from "../utils";
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
	 * Create an auction item
	 */
	private createAuctionItemRoute() {
		type ReqBody = AuctionItemReqBody;

		this.router.post<{}, {}, ReqBody>("/", async (req, res) => {
			try {
				const user = new Types.ObjectId(req.headers.user as string);
				const validationErr = auctionItemValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const auctionItem = await auctionItemController.createAuctionItem({
					entryTime: unixTs(),
					ownedBy: user,
					name: req.body.name,
					details: req.body.details,
					condition: req.body.condition,
				});
				res.status(200).send(auctionItem);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * GET "/:id"
	 * Find an existing item with a given id
	 */
	private getAuctionItemRoute() {
		type ReqParams = { id: string };

		this.router.get<ReqParams>("/:id", async (req, res) => {
			try {
				const auctionItem = await auctionItemController.getAuctionItem(
					new Types.ObjectId(req.params.id)
				);
				res.status(200).send(auctionItem);
			} catch (error: any) {
				res.status(400).send({ error: error.message });
			}
		});
	}

	/**
	 * PATCH "/:id"
	 * Update an existing item with given id
	 */
	private updateAuctionItemRoute() {
		type ReqParams = { id: string };
		type ReqBody = AuctionItemReqBody;

		this.router.patch<ReqParams, {}, ReqBody>("/:id", async (req, res) => {
			try {
				const user = new Types.ObjectId(req.headers.user as string);
				const validationErr = auctionItemValidation(req.body);
				if (validationErr) throw new Error(validationErr);

				const auctionExists = await auctionController.getActiveAuctionByItem(
					new Types.ObjectId(req.params.id)
				);

				if (auctionExists.length > 0) {
					const auction = auctionExists[0];

					if (auction.status !== AuctionStatus.entry)
						throw new Error(`Active auction exists for ${req.params.id}`);
					if (!user.equals(auction.item[0].ownedBy))
						throw new Error(`${user} does not own item ${req.params.id}`);
					await auctionItemController.updateAuctionItem(
						new Types.ObjectId(req.params.id),
						req.body
					);
					res.status(200).send({ ...auction.item, ...req.body });
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
