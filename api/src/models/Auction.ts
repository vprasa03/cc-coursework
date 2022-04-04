import { Schema, model, Types } from "mongoose";
import { AuctionStatus } from "../utils";
import { AuctionItem } from "./AuctionItem";
import { Bid } from "./Bid";
import { User } from "./User";

export interface Auction {
	_id: Types.ObjectId;
	entryTime: number;
	by: User["_id"];
	item: AuctionItem["_id"];
	bids?: Bid["byUser"][];
	startBid: number;
	highestBid?: number;
	startDate: string;
	endDate: string;
	winner?: Bid["byUser"];
	status: AuctionStatus;
}

/** mongoose model for auctions */
export const AuctionModel = model<Auction>(
	"Auction",
	new Schema<Auction>(
		{
			by: { type: Schema.Types.ObjectId, required: true },
			entryTime: { type: Number, required: true },
			item: { type: Schema.Types.ObjectId, required: true },
			bids: { type: [Schema.Types.ObjectId] },
			startBid: { type: Number, required: true },
			highestBid: { type: Number },
			startDate: { type: String, required: true, maxlength: 10 },
			endDate: { type: String, required: true, maxlength: 10 },
			winner: { type: Schema.Types.ObjectId },
			status: { type: String, required: true },
		},
		{ collection: "Auction" }
	)
);
