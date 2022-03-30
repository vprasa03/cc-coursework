import { Schema, model, Types } from "mongoose";
import { AuctionItem } from "./AuctionItem";
import { User } from "./User";

export interface Bid {
	_id: Types.ObjectId;
	forItem: AuctionItem["_id"];
	by: User["_id"];
	amount: number;
	createTime: number;
}

export const BidModel = model<Bid>(
	"Bid",
	new Schema<Bid>({
		forItem: { type: Schema.Types.ObjectId, required: true },
		by: { type: Schema.Types.ObjectId, required: true },
		amount: { type: Number, required: true },
		createTime: { type: Number, required: true },
	})
);
