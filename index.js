const express = require("express");
const app = express();
const server = require("http").createServer(app);

const config = require("./config");

if (process.env.NODE_ENV === "production") {
	// Make Express serve front-end assets in react build
	app.use(express.static("client/build"));


	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

require("./model/periodicallyUpdate")();

require("./routes/exchanges")(app);
require("./routes/market")(app);

require("./websocketbroadcasts/broadcastSession")(server);



server.listen(process.env.PORT || 5000);