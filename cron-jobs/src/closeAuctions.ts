import { auctionController } from "./controllers";
import { today } from "./utils";

export const closeAuctions = () => {
	auctionController.setClosedStatus(today());
};
