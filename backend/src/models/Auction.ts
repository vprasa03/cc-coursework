import { Schema, model, Types } from "mongoose";
import { AuctionItemModel } from "./AuctionItem";
import { BidModel } from "./Bid";
import { UserModel } from "./User";

export interface AuctionModel {
	_id: Types.ObjectId;
	createTime: number;
	by: UserModel["_id"];
	item: AuctionItemModel["_id"];
	bids: BidModel["by"][];
	startPrice: number;
	highestPrice: number;
	startTime: number;
	endTime: number;
	winner?: BidModel["by"];
	status: "open" | "completed";
}

export class Auction {
	private static model = model<AuctionModel>(
		"Auction",
		new Schema<AuctionModel>({
			by: { type: Schema.Types.ObjectId, required: true },
			createTime: { type: Number, required: true },
			item: { type: Schema.Types.ObjectId, required: true },
			bids: { type: [Schema.Types.ObjectId], required: true },
			startPrice: { type: Number, required: true },
			highestPrice: { type: Number, required: true },
			startTime: { type: Number, required: true },
			endTime: { type: Number, required: true },
			winner: { type: Schema.Types.ObjectId },
			status: { type: String, required: true },
		})
	);

	/**
	 * Create new auction with given data
	 * @param data new auction data
	 * @returns new auction
	 */
	public static async createAuction<T = Omit<AuctionModel, "_id" | "winner">>(
		data: T
	) {
		try {
			const auction = new Auction.model<T>(data);
			await auction.save();
			return auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and update auction with given data
	 * @param data updated auction data
	 * @returns updated auction
	 */
	public static async updateAuction(
		data: Partial<AuctionModel> &
			Pick<AuctionModel, "_id"> &
			Omit<
				AuctionModel,
				"by" | "item" | "startTime" | "startPrice" | "createTime"
			>
	) {
		try {
			const auction = await Auction.model.findByIdAndUpdate(data._id);
			return auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find auction with given id
	 * @param auctionId _id of the auction to find
	 * @returns auction
	 */
	public static async getAuction(auctionId: Types.ObjectId) {
		try {
			const auction = await Auction.model.findById(auctionId);
			return auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find auctions with given ids
	 * @param auctionIds _ids of the auctions to find
	 * @returns auctions
	 */
	public static async getAuctions(auctionIds: Types.ObjectId[]) {
		try {
			const auctions = await Auction.model.find({
				_id: {
					$in: auctionIds,
				},
			});
			return auctions;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and delete auction with given id
	 * @param auctionId _id of the auction to delete
	 * @returns deleted auction
	 */
	public static async deleteAuction(auctionId: Types.ObjectId) {
		try {
			const auction = await Auction.model.findByIdAndDelete(auctionId);
			return auction;
		} catch (error) {
			throw error;
		}
	}
}
