import { PipelineStage } from "mongoose";
import { Model /*, PipelineStage */ } from "mongoose";

import {
	Auction,
	Bid,
	User,
	UserExpanded,
	UserModel,
	UserReqBody,
} from "../models";

class UserController {
	constructor(private model: Model<User>) {}

	/**
	 * Create new user with given data
	 * @param data new user data
	 * @returns new user
	 */
	public async createUser(data: Omit<User, "_id">) {
		try {
			const user = new this.model(data);
			await user.save();
			return user.toObject();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and update user with given data
	 * @param userId id of user
	 * @param data updated user data
	 * @returns user
	 */
	public async updateUser(userId: User["_id"], data: Partial<UserReqBody>) {
		try {
			const user = await this.model.findByIdAndUpdate(userId, data).lean();
			return user;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Add auction to a user's auctions field upon auction creation
	 * @param userId user id
	 * @param auctionId auction id
	 * @returns user
	 */
	public async addAuction(userId: User["_id"], auctionId: Auction["_id"]) {
		try {
			const user = await this.model
				.findByIdAndUpdate(userId, {
					$addToSet: { auctions: auctionId },
				})
				.lean();
			return user;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Add bid to user's bids
	 * @param userId id of user
	 * @param bidId id of bid
	 * @returns user
	 */
	public async addAuctionBid(userId: User["_id"], bidId: Bid["_id"]) {
		try {
			const user = await this.model
				.findByIdAndUpdate(userId, {
					$addToSet: { bids: bidId },
				})
				.lean();
			return user;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find user with given id
	 * @param userId _id of the user to find
	 * @returns user
	 */
	public async getUser(userId: User["_id"]) {
		try {
			return await this.findUser({
				$match: { _id: userId },
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find user with given email
	 * @param email email of the user to find
	 * @returns user
	 */
	public async getUserWithEmail(email: User["email"]) {
		try {
			return await this.findUser({
				$match: { email: email },
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find user(s) with given params
	 * @param params Match parameters for the user(s) to find
	 * @returns UserExpanded[]
	 */
	private async findUser(params: PipelineStage.Match) {
		try {
			const auction = await this.model.aggregate<UserExpanded>([
				params,
				{
					$unwind: { path: "$bids", preserveNullAndEmptyArrays: true },
				},
				{
					$lookup: {
						from: "Bid",
						localField: "bids",
						foreignField: "_id",
						as: "bids",
					},
				},
				{
					$group: {
						_id: "$_id",
						email: { $first: "$email" },
						name: { $first: "$name" },
						entryTime: { $first: "$entryTime" },
						auctions: { $first: "$auctions" },
						bids: { $push: "$bids" },
						password: { $first: "$password" },
					},
				},
				{
					$unwind: { path: "$auctions", preserveNullAndEmptyArrays: true },
				},
				{
					$lookup: {
						from: "Auction",
						localField: "auctions",
						foreignField: "_id",
						as: "auctions",
					},
				},
				{
					$group: {
						_id: "$_id",
						email: { $first: "$email" },
						name: { $first: "$name" },
						entryTime: { $first: "$entryTime" },
						auctions: { $push: "$auctions" },
						bids: { $first: "$bids" },
						password: { $first: "$password" },
					},
				},
			]);
			return auction;
		} catch (error) {
			throw error;
		}
	}
}

export const userController = new UserController(UserModel);
