import { Schema, model, Types } from "mongoose";
import { AuctionStatus } from "../utils";
import { Bid } from "./Bid";

export interface Auction {
	_id: Types.ObjectId;
	bids: Types.ObjectId[];
	by: Types.ObjectId;
	item: Types.ObjectId;
	highestBid?: Bid[];
	startDate: string;
	endDate: string;
	winner: Types.ObjectId | null;
	status: AuctionStatus;
}

/** mongoose model for auctions */
export const AuctionModel = model<Auction>(
	"Auction",
	new Schema<Auction>(
		{
			bids: { type: [Schema.Types.ObjectId] },
			highestBid: { type: Schema.Types.ObjectId },
			startDate: { type: String, required: true, maxlength: 10 },
			endDate: { type: String, required: true, maxlength: 10 },
			winner: { type: Schema.Types.ObjectId || null },
			status: { type: String, required: true },
		},
		{ collection: "Auction" }
	)
);
