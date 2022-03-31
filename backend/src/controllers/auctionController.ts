import { Model } from "mongoose";

import { CreationType } from "../utils";
import { Auction, AuctionModel } from "../models";

class AuctionController {
	constructor(private model: Model<Auction>) {}

	/**
	 * Create new auction with given data
	 * @param data new auction data
	 * @returns new auction
	 */
	public async createAuction<T = CreationType<Auction>>(data: T) {
		try {
			const auction = new this.model<T>(data);
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
	public async updateAuction(
		data: Partial<Auction> &
			Pick<Auction, "_id"> &
			Omit<Auction, "by" | "item" | "startBid" | "createTime">
	) {
		try {
			const auction = await this.model.findByIdAndUpdate(data._id);
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
	public async getAuction(auctionId: Auction["_id"]) {
		try {
			const auction = await this.model.findById(auctionId);
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
	public async getAuctions(page: number, limit: number) {
		try {
			const auctions = await this.model
				.find()
				.sort({ createTime: -1 })
				.skip(page > 0 ? (page - 1) * limit : 0)
				.limit(limit);
			console.log(auctions);

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
	public async deleteAuction(auctionId: Auction["_id"]) {
		try {
			const auction = await this.model.findByIdAndDelete(auctionId);
			return auction;
		} catch (error) {
			throw error;
		}
	}
}
export const auctionController = new AuctionController(AuctionModel);
