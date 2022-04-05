import { Schema, model, Types } from "mongoose";
import { Auction } from "./Auction";

export interface Bid {
	_id: Types.ObjectId;
	forAuction: Auction["_id"];
	byUser: Types.ObjectId;
	amount: number;
	entryTime: number;
}

/**
 * mongoose model for bids
 */
export const BidModel = model<Bid>(
	"Bid",
	new Schema<Bid>(
		{
			forAuction: { type: Schema.Types.ObjectId, required: true },
			byUser: { type: Schema.Types.ObjectId, required: true },
			amount: { type: Number, required: true },
			entryTime: { type: Number, required: true },
		},
		{ collection: "Bid" }
	)
);
