import { Model /*, PipelineStage */ } from "mongoose";

import { Auction, Bid, User, UserModel, UserReqBody } from "../models";

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
					$addToSet: { hosted: auctionId },
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
			const user = await this.model.findById(userId).lean();
			return user;
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
			const user = await this.model.findOne({ email }).lean();
			return user;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find users with given ids
	 * @param userIds _ids of the users to find
	 * @returns users
	 */
	// 	private async findUsers(params: PipelineStage.Match) {
	// 		try {
	// 			const users = await this.model
	// 				.find({
	// 					_id: {
	// 						$in: userIds,
	// 					},
	// 				})
	// 				.lean();
	// 			return users;
	// 		} catch (error) {
	// 			throw error;
	// 		}
	// 	}
}

export const userController = new UserController(UserModel);
