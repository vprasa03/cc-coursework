import { Model } from "mongoose";
import { Auction, AuctionModel } from "../models";
import { AuctionStatus } from "../utils";
import { auctionItemController } from "./auctionItemController";

class AuctionController {
	constructor(private model: Model<Auction>) {}

	/**
	 * Find and open auction where startDate is today
	 * @returns auction
	 */
	public async setOpenStatus(startDate: Auction["startDate"]) {
		try {
			await this.model
				.updateMany({ startDate }, { $set: { status: AuctionStatus.open } })
				.lean();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and close auctions where endDate is today
	 * @returns auction
	 */
	public async setClosedStatus(endDate: Auction["endDate"]) {
		try {
			const openAuctions = await this.model
				.aggregate<Auction>([
					{
						$match: {
							endDate,
							status: AuctionStatus.open,
						},
					},
					{
						$lookup: {
							from: "Bid",
							localField: "highestBid",
							foreignField: "_id",
							as: "highestBid",
						},
					},
				])
				.limit(512);

			if (openAuctions.length > 0) {
				const closingAuctions = Promise.all(
					openAuctions.map((auc) =>
						this.model.findByIdAndUpdate(auc._id, {
							status: AuctionStatus.closed,
							...(auc.highestBid ? { winner: auc.highestBid[0].byUser } : {}),
						})
					)
				);
				const transferringOwners = Promise.all(
					openAuctions.map((auc) =>
						auctionItemController.updateAuctionItem(auc.item, {
							...(auc.highestBid ? { ownedBy: auc.highestBid[0].byUser } : {}),
						})
					)
				);

				await Promise.all([closingAuctions, transferringOwners]);
				this.setClosedStatus(endDate);
			}
		} catch (error) {
			throw error;
		}
	}
}

export const auctionController = new AuctionController(AuctionModel);
