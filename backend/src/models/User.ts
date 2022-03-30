import { Schema, model, Types } from "mongoose";
import { AuctionModel } from "./Auction";

export interface UserModel {
	_id: Types.ObjectId;
	email: string;
	name?: string;
	password: string;
	auctions?: AuctionModel["_id"][];
}

export class User {
	private static model = model<UserModel>(
		"User",
		new Schema<UserModel>({
			name: { type: String },
			email: { type: String, required: true },
			password: { type: String, required: true },
			auctions: { type: [Schema.Types.ObjectId] },
		})
	);

	/**
	 * Create new user with given data
	 * @param data new user data
	 * @returns new user
	 */
	public static async createUser<T = Omit<UserModel, "_id">>(data: T) {
		try {
			const user = new User.model<T>(data);
			await user.save();
			return user;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and update user with given data
	 * @param data updated user data
	 * @returns updated user
	 */
	public static async updateUser(
		data: Partial<UserModel> & Pick<UserModel, "_id">
	) {
		try {
			const user = await User.model.findByIdAndUpdate(data._id);
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
	public static async getUser(userId: Types.ObjectId) {
		try {
			const user = await User.model.findById(userId);
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
	public static async getUsers(userIds: Types.ObjectId[]) {
		try {
			const users = await User.model.find({
				_id: {
					$in: userIds,
				},
			});
			return users;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Find and delete user with given id
	 * @param userId _id of the user to delete
	 * @returns deleted user
	 */
	public static async deleteUser(userId: Types.ObjectId) {
		try {
			const user = await User.model.findByIdAndDelete(userId);
			return user;
		} catch (error) {
			throw error;
		}
	}
}
