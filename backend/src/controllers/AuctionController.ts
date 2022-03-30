import { CreationType } from "../utils";
import { Auction, AuctionModel } from "../models";

export class AuctionController {
	private static model = AuctionModel;

	/**
	 * Create new auction with given data
	 * @param data new auction data
	 * @returns new auction
	 */
	public static async createAuction<T = CreationType<Auction>>(data: T) {
		try {
			const auction = new AuctionController.model<T>(data);
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
		data: Partial<Auction> &
			Pick<Auction, "_id"> &
			Omit<Auction, "by" | "item" | "startBid" | "createTime">
	) {
		try {
			const auction = await AuctionController.model.findByIdAndUpdate(data._id);
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
	public static async getAuction(auctionId: Auction["_id"]) {
		try {
			const auction = await AuctionController.model.findById(auctionId);
			return auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find all auctions or auctions with given ids
	 * @param auctionIds _ids of the auctions to find
	 * @returns auctions
	 */
	public static async getAuctions(auctionIds?: Auction["_id"][]) {
		try {
			const auctions = await AuctionController.model.find(
				auctionIds !== undefined
					? {
							_id: {
								$in: auctionIds,
							},
					  }
					: {}
			);
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
	public static async deleteAuction(auctionId: Auction["_id"]) {
		try {
			const auction = await AuctionController.model.findByIdAndDelete(
				auctionId
			);
			return auction;
		} catch (error) {
			throw error;
		}
	}
}
