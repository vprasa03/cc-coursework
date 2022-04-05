import { Model } from "mongoose";

import { AuctionItem, AuctionItemModel } from "../models";

class AuctionItemController {
	constructor(private model: Model<AuctionItem>) {}

	/**
	 * Find and update auction item with given id
	 * @param itemId _id of the item to update
	 * @param data
	 * @returns auction item
	 */
	public async updateAuctionItem(
		itemId: AuctionItem["_id"],
		data: Partial<AuctionItem>
	) {
		try {
			const item = await this.model.findByIdAndUpdate(itemId, data).lean();
			return item;
		} catch (error) {
			throw error;
		}
	}
}

export const auctionItemController = new AuctionItemController(
	AuctionItemModel
);
