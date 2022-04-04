import { Schema, model, Types } from "mongoose";
import { ItemCondition } from "../utils";
import { User } from "./User";

export interface AuctionItem {
	_id: Types.ObjectId;
	entryTime: number;
	ownedBy: User["_id"];
	details: string;
	name: string;
	condition: ItemCondition;
}

/**
 * mongoose model for auction items
 */
export const AuctionItemModel = model<AuctionItem>(
	"AuctionItem",
	new Schema<AuctionItem>(
		{
			entryTime: { type: Number, required: true },
			ownedBy: { type: Schema.Types.ObjectId, required: true },
			name: { type: String, required: true },
			details: { type: String, required: true },
			condition: { type: String, required: true },
		},
		{ collection: "AuctionItem" }
	)
);
