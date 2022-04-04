import { connect } from "mongoose";
import dotenv = require("dotenv");
import cron = require("node-cron");
import { isNativeError } from "util/types";

const envVars = dotenv.config();

/**
 * Initialise cron jobs on successful connect to MongoDB
 */
function onDBConnect() {
	let i = 0;

	cron.schedule("* * * * * *", () => {
		console.log(i++);
	});
}

const dbUrl = envVars.parsed?.MURL; // Get MongoDB url

/**
 * Connect to MongoDB
 * @param successCB Callback on successful connect
 */
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
	} catch (error: any) {
		console.error(error.message, "\nRetry DB connection...");
		connectDB(successCB);
	}
}

connectDB(onDBConnect);
