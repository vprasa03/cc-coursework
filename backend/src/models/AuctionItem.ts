import { Schema, model, Types } from "mongoose";

export interface AuctionItem {
	_id: Types.ObjectId;
	createTime: number;
	details: string;
	name: string;
	condition: "new" | "used";
}

export const AuctionItemModel = model<AuctionItem>(
	"AuctionItem",
	new Schema<AuctionItem>(
		{
			createTime: { type: Number, required: true },
			name: { type: String, required: true },
			details: { type: String, required: true },
			condition: { type: String, required: true },
		},
		{ collection: "AuctionItem" }
	)
);
