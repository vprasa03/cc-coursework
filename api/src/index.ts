import { connect } from "mongoose";
import dotenv = require("dotenv");
import { isNativeError } from "util/types";

import { app } from "./App";

const envVars = dotenv.config();

function onDBConnect() {
	app.start(3000);
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
