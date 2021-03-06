import { Router } from "express";
import bodyParser = require("body-parser");
import express = require("express");

import {
	auctionRoute,
	auctionsRoute,
	authRoute,
	bidsRoute,
	userRoute,
} from "./routes";

/**
 * The App
 * @public
 */
class AuctionApp {
	private expressInstance = express();

	constructor() {
		// Add routes and middleware
		this.useMiddleware(bodyParser.json());
		this.useRoute("/auth", authRoute.getRouter());
		this.useRoute("/user", userRoute.getRouter());
		this.useRoute("/auctions", auctionsRoute.getRouter());
		this.useRoute("/auction", auctionRoute.getRouter());
		this.useRoute("/bids", bidsRoute.getRouter());
	}

	/**
	 * Start express server
	 * @param portNo Port for express.listen
	 */
	public start(portNo: number) {
		this.expressInstance.listen(portNo, () => {
			console.log(`Express server running on port ${portNo}`);
		});
	}

	/**
	 * Use middleware
	 * @param middleware
	 */
	public useMiddleware(middleware: any) {
		this.expressInstance.use(middleware);
	}

	/**
	 * Use a router on  given route
	 * @param route
	 * @param router
	 */
	public useRoute(route: string, router: Router) {
		this.expressInstance.use(`/api${route}`, router);
	}
}

export const app = new AuctionApp();
