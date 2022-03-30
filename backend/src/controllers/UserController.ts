import { CreationType } from "../utils";
import { User, UserModel } from "../models";

export class UserController {
	private static model = UserModel;

	/**
	 * Create new user with given data
	 * @param data new user data
	 * @returns new user
	 */
	public static async createUser<T = CreationType<User>>(data: T) {
		try {
			const user = new UserController.model<T>(data);
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
	public static async updateUser(data: Partial<User> & Pick<User, "_id">) {
		try {
			const user = await UserController.model.findByIdAndUpdate(data._id);
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
	public static async getUser(userId: User["_id"]) {
		try {
			const user = await UserController.model.findById(userId);
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
	public static async getUsers(userIds: User["_id"]) {
		try {
			const users = await UserController.model.find({
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
	public static async deleteUser(userId: User["_id"]) {
		try {
			const user = await UserController.model.findByIdAndDelete(userId);
			return user;
		} catch (error) {
			throw error;
		}
	}
}
