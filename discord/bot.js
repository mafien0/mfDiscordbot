const { Client, Events, GatewayIntentBits } = require("discord.js");

function createBot() {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.once(Events.ClientReady, (c) => {
		console.log(`Discord bot logged in as ${c.user.tag}`);
	});

	return client;
}

module.exports = { createBot };
