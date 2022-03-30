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
	 * Use middleware
	 * @param middleware
	 */
	public static useMiddleware(middleware: any) {
		App.expressInstance.use(middleware);
	}

	/**
	 * Use router on route
	 * @param route
	 * @param router
	 */
	public static useRoute(route: string, router: Router) {
		App.expressInstance.use(route, router);
	}
}
