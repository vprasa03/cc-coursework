import { Schema, model, connect, Types } from "mongoose";

interface UserModel {
	_id?: Types.ObjectId;
	email?: string;
	name?: string;
	password?: string;
}

export class User {
	private static model = model<UserModel>(
		"User",
		new Schema<UserModel>({
			name: { type: String },
			email: { type: String, required: true },
			password: { type: String, required: true },
		})
	);

	/**
	 * Create new user with given data
	 * @param data new user data
	 * @returns new user
	 */
	public static async createUser(
		data: UserModel & { email: string; password: string }
	) {
		try {
			const user = new User.model<UserModel>(data);
			await user.save();
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
	 * Find and update user with given data
	 * @param data updated user data
	 * @returns updated user
	 */
	public static async updateUser(data: User & { _id: Types.ObjectId }) {
		try {
			const user = await User.model.findByIdAndUpdate(data._id);
			return user;
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

run().catch((err) => console.log(err));

async function run() {
	await connect("mongodb://localhost:27017/test");

	// const doc = new UserModel<User>({
	// 	name: "Bill",
	// 	email: "bill@initech.com",
	// 	password: "https://i.imgur.com/dM7Thhn.png",
	// });
	// await doc.save();

	// console.log(doc.email); // 'bill@initech.com'
}
