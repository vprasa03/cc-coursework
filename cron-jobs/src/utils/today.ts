import { Auction } from "../models";

/**
 * Gives today's date in DD-MM-YYYY format
 * @returns DD-MM-YYYY
 */
export const today = (): Auction["endDate"] | Auction["startDate"] => {
	const date = new Date();
	return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getFullYear()}`;
};
