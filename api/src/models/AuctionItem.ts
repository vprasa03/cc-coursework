import { Schema, model, Types } from "mongoose";
import { ItemCondition } from "../utils";
import { User } from "./User";

interface AuctionItemBase {
	_id: Types.ObjectId;
	entryTime: number;
	details: string;
	name: string;
	condition: ItemCondition;
}
export interface AuctionItem extends AuctionItemBase {
	ownedBy: User["_id"];
}

export type AuctionItemReqBody = Omit<AuctionItemBase, "_id" | "entryTime">;

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
