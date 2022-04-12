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
			const openAuctions = await this.model.aggregate<Auction>([
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
				{
					$limit: 1000,
				},
			]);
			if (openAuctions.length > 0) {
				const bulkCloseAuctions = openAuctions.map((auc) => {
					return {
						updateOne: {
							filter: { _id: auc._id },
							update: {
								status: AuctionStatus.closed,
								...(auc.highestBid && auc.highestBid.length > 0
									? { winner: auc.highestBid[0].byUser }
									: {}),
							},
						},
					};
				});

				const bulkTransferOwners = openAuctions.map((auc) => {
					return {
						updateOne: {
							filter: { _id: auc.item },
							update: {
								$set: {
									ownedBy:
										auc.highestBid && auc.highestBid.length > 0
											? auc.highestBid[0].byUser
											: auc.by,
								},
							},
						},
					};
				});

				const res = await Promise.all([
					this.model.bulkWrite(bulkCloseAuctions),
					auctionItemController.bulkUpdate(bulkTransferOwners),
				]);
				console.log(
					"Bulk close result:\n",
					"Close auctions: ",
					res[0],
					"; Transfer owners: ",
					res[1]
				);

				this.setClosedStatus(endDate);
			}
		} catch (error) {
			throw error;
		}
	}
}

export const auctionController = new AuctionController(AuctionModel);
