import dotenv = require("dotenv");

import { App } from "./App";
import { bidsRoute, rootRoute } from "./routes";

const envVars = dotenv.config();
console.log(envVars.parsed?.ENV_VAR);

App.use("/", rootRoute.getRouter());
App.use("/bids", bidsRoute.getRouter());

App.start(3000);
