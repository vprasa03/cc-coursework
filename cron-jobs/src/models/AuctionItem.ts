import { Schema, model, Types } from "mongoose";

export interface AuctionItem {
	_id: Types.ObjectId;
	ownedBy: Types.ObjectId;
}

/**
 * mongoose model for auction items
 */
export const AuctionItemModel = model<AuctionItem>(
	"AuctionItem",
	new Schema<AuctionItem>(
		{
			ownedBy: { type: Schema.Types.ObjectId, required: true },
		},
		{ collection: "AuctionItem" }
	)
);
