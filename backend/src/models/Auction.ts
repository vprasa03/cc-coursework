import { Schema, model, Types } from "mongoose";
import { AuctionItem } from "./AuctionItem";
import { Bid } from "./Bid";
import { User } from "./User";

export interface Auction {
	_id: Types.ObjectId;
	createTime: number;
	by: User["_id"];
	item: AuctionItem["_id"];
	bids?: Bid["by"][];
	participants?: User["_id"][];
	startBid: number;
	highestBid?: number;
	endTime: number;
	winner?: Bid["by"];
	status: "open" | "completed";
}

export const AuctionModel = model<Auction>(
	"Auction",
	new Schema<Auction>(
		{
			by: { type: Schema.Types.ObjectId, required: true },
			createTime: { type: Number, required: true },
			item: { type: Schema.Types.ObjectId, required: true },
			bids: { type: [Schema.Types.ObjectId] },
			participants: { type: [Schema.Types.ObjectId] },
			startBid: { type: Number, required: true },
			highestBid: { type: Number },
			endTime: { type: Number, required: true },
			winner: { type: Schema.Types.ObjectId },
			status: { type: String, required: true },
		},
		{ collection: "Auction" }
	)
);
