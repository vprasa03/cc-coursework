import { auctionController } from "./controllers";
import { today } from "./utils";

export const openAuctions = () => {
	const day = today();
	console.log("Opening auctions for ", day);
	auctionController.setOpenStatus(day);
};
