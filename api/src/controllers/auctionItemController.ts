import { Model } from "mongoose";

import { AuctionItem, AuctionItemModel } from "../models";

class AuctionItemController {
	constructor(private model: Model<AuctionItem>) {}

	/**
	 * Create new auction item with given data
	 * @param data auction item data
	 * @returns new auction item
	 */
	public async createAuctionItem(data: Omit<AuctionItem, "_id">) {
		try {
			const auctionItem = new this.model(data);
			await auctionItem.save();
			return auctionItem.toObject();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find auction item with given id
	 * @param itemId _id of the item to find
	 * @returns auction item
	 */
	public async getAuctionItem(itemId: AuctionItem["_id"]) {
		try {
			const auctionItem = await this.model.findById(itemId).lean();
			return auctionItem;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find auction items with given ids
	 * @param itemIds _ids of the items to find
	 * @returns auction items
	 */
	public async getAuctionItems(itemIds: AuctionItem["_id"][]) {
		try {
			const auctionItems = await this.model
				.find({
					_id: {
						$in: itemIds,
					},
				})
				.lean();
			return auctionItems;
		} catch (error) {
			throw error;
		}
	}

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
