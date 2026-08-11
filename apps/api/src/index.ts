import config from "./lib/config.js";
import { createServer } from "./server.js";

const app = createServer();


app.listen(config.port, () => {
	console.log(`app is running on port: ${config.port}`);
});
