import { connect } from "mongoose";
import dotenv = require("dotenv");
import cron = require("node-cron");
import { isNativeError } from "util/types";
import { closeAuctions } from "./closeAuctions";
import { openAuctions } from "./openAuctions";

const envVars = dotenv.config();

/**
 * Initialise cron jobs on successful connect to MongoDB
 */
function onDBConnect() {
	// Close auctions at 23:59 daily
	cron.schedule("59 23 * * *", closeAuctions);
	// Open auctions at 00:00 daily
	cron.schedule("0 0 * * *", openAuctions);
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
				console.log("MongoDB connection successful");
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
