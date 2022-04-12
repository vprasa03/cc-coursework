import { Schema, model, Types } from "mongoose";
import { Auction } from "./Auction";
import { Bid } from "./Bid";

export interface UserReqBody {
	email: string;
	name?: string;
	password: string;
}

interface UserBase extends UserReqBody {
	_id: Types.ObjectId;
	entryTime: number;
}

export interface User extends UserBase {
	_id: Types.ObjectId;
	auctions?: Auction["_id"][];
	bids?: Bid["_id"][];
}

export interface UserExpanded extends UserBase {
	_id: Types.ObjectId;
	auctions?: Auction[];
	bids?: Bid[];
}

/**
 * mongoose model for users
 */
export const UserModel = model<User>(
	"User",
	new Schema<User>(
		{
			name: { type: String },
			email: { type: String, required: true, unique: true },
			password: { type: String, required: true },
			auctions: { type: [Schema.Types.ObjectId] },
			bids: { type: [Schema.Types.ObjectId] },
			entryTime: { type: Number, required: true },
		},
		{ collection: "User" }
	)
);
