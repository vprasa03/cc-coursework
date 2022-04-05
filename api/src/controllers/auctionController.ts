import { Model } from "mongoose";

import { EntryType } from "../utils";
import { Auction, AuctionItem, AuctionModel, Bid, User } from "../models";

class AuctionController {
	constructor(private model: Model<Auction>) {}

	/**
	 * Create new auction with given data
	 * @param data new auction data
	 * @returns new auction
	 */
	public async createAuction<T = EntryType<Auction>>(data: T) {
		try {
			const auction = new this.model<T>(data);
			await auction.save();
			return <Auction>auction.toObject();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and update auction with given data
	 * @param id id of auction to update
	 * @param data updated auction data
	 * @returns auction
	 */
	public async updateAuction(id: Auction["_id"], data: Partial<Auction>) {
		try {
			const auction = await this.model
				.findByIdAndUpdate(id, {
					...data,
					$set: {
						startDate: {
							$cond: {
								if: { $eq: ["$auctionStatus", "entry"] },
								then: data.startDate,
								else: "$startDate",
							},
						},
					},
				})
				.lean();
			return <Auction>auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Add bid to auction
	 * @param id id of auction to update
	 * @param bid new bid id
	 * @returns  auction
	 */
	public async addAuctionBid(id: Auction["_id"], bid: Bid) {
		try {
			const auction = await this.model
				.findByIdAndUpdate(id, {
					$push: { bids: bid._id },
					$set: { highestBid: bid._id },
				})
				.lean();
			return <Auction>auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Add participant to auction
	 * @param id id of item to update
	 * @param user new participant's id
	 * @returns updated auction
	 */
	public async addAuctionParticipant(id: Auction["_id"], user: User["_id"]) {
		try {
			const auction = await this.model
				.findByIdAndUpdate(id, {
					$addToSet: { participants: user },
				})
				.lean();
			return <Auction>auction;
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
			const auction = await this.model.findById(auctionId).lean();
			return <Auction>auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find auction with given item
	 * @param itemId _id of the item in the auction
	 * @returns auction
	 */
	public async getAuctionByItem(itemId: AuctionItem["_id"]) {
		try {
			const auction = await this.model.findOne({ item: itemId }).lean();
			return <Auction>auction;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find all auctions in descending order of end date
	 * @param page page number
	 * @param limit limit per page
	 * @returns auctions
	 */
	public async getAuctions(page: number, limit: number) {
		try {
			const auctions = await this.model
				.find()
				.sort({ endDate: -1 })
				.skip(page > 0 ? (page - 1) * limit : 0)
				.limit(limit)
				.lean();
			return <Auction[]>auctions;
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
			const auction = await this.model.findByIdAndDelete(auctionId).lean();
			return <Auction>auction;
		} catch (error) {
			throw error;
		}
	}
}
export const auctionController = new AuctionController(AuctionModel);
