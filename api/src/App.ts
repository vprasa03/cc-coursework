import { Router } from "express";
import bodyParser = require("body-parser");
import express = require("express");

import { auctionRoute, auctionsRoute, authRoute, userRoute } from "./routes";

/**
 * The App
 * @public
 */
class AuctionApp {
	private expressInstance = express();

	constructor() {
		this.useMiddleware(bodyParser.json());
		this.useRoute("/auth", authRoute.getRouter());
		this.useRoute("/user", userRoute.getRouter());
		this.useRoute("/auctions", auctionsRoute.getRouter());
		this.useRoute("/auction", auctionRoute.getRouter());
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
	 * Use router on route
	 * @param route
	 * @param router
	 */
	public useRoute(route: string, router: Router) {
		this.expressInstance.use(`/api${route}`, router);
	}
}

export const app = new AuctionApp();
