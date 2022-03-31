import { Model } from "mongoose";

import { CreationType } from "../utils";
import { User, UserModel } from "../models";

class UserController {
	constructor(private model: Model<User>) {}

	/**
	 * Create new user with given data
	 * @param data new user data
	 * @returns new user
	 */
	public async createUser<T = CreationType<User>>(data: T) {
		try {
			const user = new this.model<T>(data);
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
	public async updateUser(data: Partial<User> & Pick<User, "_id">) {
		try {
			const user = await this.model.findByIdAndUpdate(data._id);
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
			const user = await this.model.findById(userId);
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
	public async getUsers(userIds: User["_id"]) {
		try {
			const users = await this.model.find({
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
	public async deleteUser(userId: User["_id"]) {
		try {
			const user = await this.model.findByIdAndDelete(userId);
			return user;
		} catch (error) {
			throw error;
		}
	}
}

export const userController = new UserController(UserModel);
