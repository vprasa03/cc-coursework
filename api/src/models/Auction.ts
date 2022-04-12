import { Schema, model, Types } from "mongoose";
import { AuctionStatus } from "../utils";
import { AuctionItem } from "./AuctionItem";
import { Bid } from "./Bid";
import { User } from "./User";

interface AuctionBase {
	_id: Types.ObjectId;
	by: User["_id"];
	entryTime: number;
	startBid: number;
	startDate: string;
	endDate: string;
	winner?: Bid["byUser"];
	status: AuctionStatus;
}

export interface AuctionReqBody
	extends Pick<AuctionBase, "startBid" | "startDate" | "endDate"> {
	item: string;
}

export interface Auction extends AuctionBase {
	item: AuctionItem["_id"];
	bids?: Bid["byUser"][];
	highestBid?: Bid["_id"];
}

export interface AuctionExpanded extends AuctionBase {
	item: AuctionItem[];
	bids?: Bid[];
	highestBid?: Bid[];
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
			highestBid: { type: Schema.Types.ObjectId },
			startDate: { type: String, required: true, maxlength: 10 },
			endDate: { type: String, required: true, maxlength: 10 },
			winner: { type: Schema.Types.ObjectId },
			status: { type: String, required: true },
		},
		{ collection: "Auction" }
	)
);
