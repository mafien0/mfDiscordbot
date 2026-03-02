require("dotenv").config();

const { createStatusMsg } = require("./discord/statusService");

const { createRouter } = require("./api/routes");
const { createBot } = require("./discord/bot");

const { setDiscordClient, initChannels } = require("./discord/messageService");

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
	setDiscordClient(bot);
	initChannels().then(() => {
		console.log("Channels initialized");

		// Debug
		createStatusMsg();

		console.log("Discord bot is up");
	});
});
