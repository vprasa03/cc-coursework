import { auctionController } from "./controllers";
import { today } from "./utils";

export const closeAuctions = () => {
	const day = today();
	console.log("Closing auctions for ", day);
	auctionController.setClosedStatus(day);
};
