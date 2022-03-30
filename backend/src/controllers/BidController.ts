import { CreationType } from "../utils";
import { Bid, BidModel } from "../models";

export class BidController {
	private static model = BidModel;

	/**
	 * Create new bid for given auction item
	 * @param data new bid
	 * @returns new bid
	 */
	public static async createBid<T = CreationType<Bid>>(data: T) {
		try {
			const bid = new BidController.model<T>(data);
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
	public static async getBid(bidId: Bid["_id"]) {
		try {
			const bid = await BidController.model.findById(bidId);
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
	public static async getBids(bidIds: Bid["_id"][]) {
		try {
			const bids = await BidController.model.find({
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
