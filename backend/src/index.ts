import { connect } from "mongoose";
import dotenv = require("dotenv");
import bodyParser = require("body-parser");
import { isNativeError } from "util/types";

import { App } from "./App";
import { auctionRoute, auctionsRoute, userRoute } from "./routes";

const envVars = dotenv.config();

function onDBConnect() {
	App.useMiddleware(bodyParser.json());
	App.useRoute("/user", userRoute.getRouter());
	App.useRoute("/auctions", auctionsRoute.getRouter());
	App.useRoute("/auction", auctionRoute.getRouter());

	App.start(3000);
}

const dbUrl = envVars.parsed?.MURL;

function connectDB(successCB: () => void) {
	try {
		if (dbUrl) {
			connect(dbUrl, (error) => {
				if (isNativeError(error)) throw error;
				successCB();
			});
		} else {
			throw new Error("DB url not found!");
		}
	} catch (error) {
		console.error(error, "\nRetry DB connection...");
		connectDB(successCB);
	}
}

connectDB(onDBConnect);
