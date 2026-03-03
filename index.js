import "dotenv/config";

import { createStatusMsg } from "./discord/statusService.js";

import { createRouter } from "./api/routes.js";
import { createBot } from "./discord/bot.js";

import { setDiscordClient, initChannels } from "./discord/messageService.js";

// Create API
const app = createRouter();
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`API is running on port ${port}`);
});

// Create discord bot
const bot = createBot();
const token = process.env.DISCORD_TOKEN;

if (!token) {
	throw new Error("DISCORD_TOKEN environment variable is required");
}

bot.login(token).then(() => {
	console.log("Discord bot is up");
	setDiscordClient(bot);
	initChannels().then(() => {
		createStatusMsg();
	});
});
