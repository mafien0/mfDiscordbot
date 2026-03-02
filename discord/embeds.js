const { EmbedBuilder, resolveColor } = require("discord.js");

const config = require("../config.json");
const colors = config.discord.embed.colors;

// Embed generator
function generateEmbed(header, content, color = null) {
	if (!header) throw new Error("Header cannot be empty");
	if (!content) throw new Error("Content cannot be empty");
	if (!color) color = colors.white || "#ffffff";

	return new EmbedBuilder()
		.setTitle(header)
		.setDescription(content)
		.setColor(resolveColor(color));
}

// Different types of embeds
const createMessage = (header, content) =>
	generateEmbed(header, content, colors.white || "#ffffff");
const createError = (header, content) =>
	generateEmbed(header, content, colors.red || "#ff0000");
const createSuccess = (header, content) =>
	generateEmbed(header, content, colors.green || "#00ff00");
const createWarning = (header, content) =>
	generateEmbed(header, content, colors.yellow || "#ffff00");

function createStatusEmbed(s) {
	if (!s) throw new Error("No status specified");
	const color = s.status === "online" ? colors.green : colors.gray;
	return new EmbedBuilder().setTitle(s.name).setColor(color).setDescription(`
		Health: ${s.health}
		Hunger: ${s.hunger}
		Ping: ${s.ping}
		Coords: ${s.coords}
		Dimension: ${s.dimension}
		${"-".repeat(30)}
		${s.info}
		`);
}

module.exports = {
	createMessage,
	createError,
	createSuccess,
	createWarning,
	createStatusEmbed,
};
