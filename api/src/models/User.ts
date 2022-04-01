import { Schema, model, Types } from "mongoose";
import { Auction } from "./Auction";
import { Bid } from "./Bid";

export interface User {
	_id: Types.ObjectId;
	email: string;
	name?: string;
	password: string;
	auctions?: Auction["_id"][];
	bids?: Bid["_id"][];
	createTime: number;
}

export const UserModel = model<User>(
	"User",
	new Schema<User>(
		{
			name: { type: String },
			email: { type: String, required: true, unique: true },
			password: { type: String, required: true },
			auctions: { type: [Schema.Types.ObjectId] },
			bids: { type: [Schema.Types.ObjectId] },
			createTime: { type: Number, required: true },
		},
		{ collection: "User" }
	)
);
