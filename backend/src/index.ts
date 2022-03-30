import { connect } from "mongoose";
import dotenv = require("dotenv");

import { App } from "./App";
import { bidsRoute, rootRoute } from "./routes";
import { isNativeError } from "util/types";

const envVars = dotenv.config();

function onDBConnect() {
	App.use("/", rootRoute.getRouter());
	App.use("/bids", bidsRoute.getRouter());

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
