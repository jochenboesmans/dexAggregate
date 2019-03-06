import dotenv from "dotenv";
dotenv.config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);

import { initialize } from "./market/market";
initialize();

require("./routes")(app);

require("./websocketbroadcasts/broadcastSession").initialize(server);

server.listen(process.env.SERVER_PORT || 5000);