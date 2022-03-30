import { Schema, model, Types } from "mongoose";
import { AuctionItemModel } from "./AuctionItem";
import { UserModel } from "./User";

export interface BidModel {
	_id: Types.ObjectId;
	forItem: AuctionItemModel["_id"];
	by: UserModel["_id"];
	amount: number;
	time: number;
}

export class Bid {
	private static model = model<BidModel>(
		"Bid",
		new Schema<BidModel>({
			forItem: { type: Schema.Types.ObjectId, required: true },
			by: { type: Schema.Types.ObjectId, required: true },
			amount: { type: Number, required: true },
			time: { type: Number, required: true },
		})
	);

	/**
	 * Create new bid for given auction item
	 * @param data new bid
	 * @returns new bid
	 */
	public static async createBid<T = Omit<BidModel, "_id">>(data: T) {
		try {
			const bid = new Bid.model<T>(data);
			await bid.save();
			return bid;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find bid with given id
	 * @param bidId _id of the bid to find
	 * @returns bid
	 */
	public static async getBid(bidId: Types.ObjectId) {
		try {
			const bid = await Bid.model.findById(bidId);
			return bid;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find bids with given ids
	 * @param bidIds _ids of the bids to find
	 * @returns bids
	 */
	public static async getBids(bidIds: Types.ObjectId[]) {
		try {
			const bids = await Bid.model.find({
				_id: {
					$in: bidIds,
				},
			});
			return bids;
		} catch (error) {
			throw error;
		}
	}
}
