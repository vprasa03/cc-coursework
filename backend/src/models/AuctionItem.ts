import { Schema, model, Types } from "mongoose";

export interface AuctionItemModel {
	_id: Types.ObjectId;
	createTime: number;
	details: string;
	name: string;
	condition: "New" | "Used";
}

export class AuctionItem {
	private static model = model<AuctionItemModel>(
		"AuctionItem",
		new Schema<AuctionItemModel>({
			createTime: { type: Number, required: true },
			name: { type: String, required: true },
			details: { type: String, required: true },
			condition: { type: String, required: true },
		})
	);

	/**
	 * Create new auctin item with given data
	 * @param data auction item data
	 * @returns new auction item
	 */
	public static async createAuctionItem<
		T = Omit<AuctionItemModel, "_id" | "createTime">
	>(data: T) {
		try {
			const auctionItem = new AuctionItem.model<T>(data);
			await auctionItem.save();
			return auctionItem;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and update item with given data
	 * @param data updated item data
	 * @returns updated auction item
	 */
	public static async updateAuctionItem(
		data: Partial<AuctionItemModel> &
			Pick<AuctionItemModel, "_id"> &
			Omit<AuctionItemModel, "createTime">
	) {
		try {
			const auctionItem = await AuctionItem.model.findByIdAndUpdate(data._id);
			return auctionItem;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find auction item with given id
	 * @param itemId _id of the item to find
	 * @returns auction item
	 */
	public static async getAuctionItem(itemId: Types.ObjectId) {
		try {
			const auctionItem = await AuctionItem.model.findById(itemId);
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
	public static async getAuctionItems(itemIds: Types.ObjectId[]) {
		try {
			const auctionItems = await AuctionItem.model.find({
				_id: {
					$in: itemIds,
				},
			});
			return auctionItems;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and delete auction item with given id
	 * @param itemId _id of the item to delete
	 * @returns deleted auction item
	 */
	public static async deleteAuctionItem(itemId: Types.ObjectId) {
		try {
			const item = await AuctionItem.model.findByIdAndDelete(itemId);
			return item;
		} catch (error) {
			throw error;
		}
	}
}
