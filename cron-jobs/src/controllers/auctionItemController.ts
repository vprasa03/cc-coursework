import { Model } from "mongoose";

import { AuctionItem, AuctionItemModel } from "../models";

class AuctionItemController {
	constructor(private model: Model<AuctionItem>) {}

	/**
	 * Bulk update auction items with new owners
	 * @param data
	 * @returns auction item
	 */
	public async bulkUpdate(data: any[]) {
		try {
			const res = await this.model.bulkWrite(data);
			return res;
		} catch (error) {
			throw error;
		}
	}
}

export const auctionItemController = new AuctionItemController(
	AuctionItemModel
);
