const { createStatusEmbed } = require("./embeds");

// Hold a reference to the Discord client, set from index.js
let client = null;

const config = require("../config.json");
const channelID = config.discord.channels;

// Channels will be filled on bot login
const CHANNELS = {
	chat: null,
	status: null,
	updates: null,
};

function setDiscordClient(discordClient) {
	if (!discordClient) throw new Error("Discord client is required");
	client = discordClient;
}

async function getChannelById(id) {
	if (!id) throw new Error("No channel ID provided");
	if (!client) throw new Error("Discord client is not initialized");

	try {
		const channel = await client.channels.fetch(id);

		if (!channel) {
			throw new Error(`Channel not found for ID: ${id}`);
		}
		if (!channel.isTextBased()) {
			throw new Error(`Channel ${id} is not text-based`);
		}

		return channel;
	} catch (error) {
		console.error(`Failed to fetch channel ${id}: ${error.message}`);
		throw error;
	}
}

async function initChannels() {
	try {
		CHANNELS.chat = await getChannelById(channelID.chat);
		CHANNELS.status = await getChannelById(channelID.status);
		CHANNELS.updates = await getChannelById(channelID.updates);
		console.log("All Discord channels initialized successfully");
	} catch (error) {
		console.error(`Failed to initialize channels: ${error.message}`);
		throw error;
	}
}

async function sendMsg(msg, type = "chat") {
	if (!msg) throw new Error("No message provided");
	if (!CHANNELS[type]) {
		throw new Error(`Channel for type "${type}" is not initialized`);
	}

	try {
		console.log(`Sending message to "${type}" channel`);
		return await CHANNELS[type].send(msg);
	} catch (error) {
		console.error(
			`Failed to send message to "${type}" channel: ${error.message}`,
		);
		throw error;
	}
}

const sendEmbedMsg = async (msg, type = "chat") =>
	sendMsg({ embeds: [msg] }, type);

module.exports = {
	setDiscordClient,
	initChannels,
	sendMsg,
	sendEmbedMsg,
};
