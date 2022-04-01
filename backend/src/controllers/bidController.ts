import { Model } from "mongoose";

import { CreationType } from "../utils";
import { Bid, BidModel } from "../models";

class BidController {
	constructor(private model: Model<Bid>) {}

	/**
	 * Create new bid for given auction item
	 * @param data new bid
	 * @returns new bid
	 */
	public async createBid<T = CreationType<Bid>>(data: T) {
		try {
			const bid = new this.model<T>(data);
			await bid.save();
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
	public async getBids(bidIds: Bid["_id"][]) {
		try {
			const bids = await this.model.find({
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

export const bidController = new BidController(BidModel);
