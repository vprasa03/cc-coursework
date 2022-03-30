import { connect } from "mongoose";
import dotenv = require("dotenv");
import bodyParser = require("body-parser");
import { isNativeError } from "util/types";

import { App } from "./App";
import { auctionsRoute, userRoute } from "./routes";

const envVars = dotenv.config();

function onDBConnect() {
	App.useMiddleware(bodyParser.json());
	App.useRoute("/user", userRoute.getRouter());
	App.useRoute("/auctions", auctionsRoute.getRouter());

	App.start(3000);
}

function connectDB(successCB: () => void) {
	try {
		connect(envVars.parsed?.MURL, (error) => {
			if (isNativeError(error)) throw error;
			successCB();
		});
	} catch (error) {
		console.error(error, "\nRetry DB connection...");
		connectDB(successCB);
	}
}

connectDB(onDBConnect);
