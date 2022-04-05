import { auctionController } from "./controllers";
import { today } from "./utils";

export const openAuctions = () => {
	auctionController.setOpenStatus(today());
};
