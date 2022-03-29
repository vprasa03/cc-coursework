import { Router } from "express";
import express = require("express");

/**
 * The App
 * @public
 */
export class App {
	private static expressInstance = express();

	/**
	 * Start express server
	 * @param portNo Port for express.listen
	 */
	public static start(portNo: number) {
		App.expressInstance.listen(portNo, () => {
			console.log(`Express server running on port ${portNo}`);
		});
	}

	/**
	 * Use router on route
	 * @param route
	 * @param router
	 */
	public static use(route: string, router: Router) {
		App.expressInstance.use(route, router);
	}
}
