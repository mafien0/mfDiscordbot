import { createStatusEmbed } from "./embeds.js";
import { sendEmbedMsg, wipeMessages } from "./messageService.js";

let statusMsg;

const status = {
	status: null,
	name: null,
	health: null,
	hunger: null,
	ping: null,
	coords: null,
	dimension: null,
	info: null,
};

// Validate status field
export const validateStatusField = (field) => field in status;

export async function createStatusMsg() {
	// Delete all old messages in the channel
	try {
		await wipeMessages("status");
	} catch (error) {
		console.error(
			`Failed to wipe messages in status channel: ${error.message}`,
		);
		// No need to throw it back
		// Its not that of an issue if there is old messages in the channel
	}

	// Send a new one
	try {
		const embed = createStatusEmbed(status);
		const msg = await sendEmbedMsg(embed, "status");

		console.log(`Sent initial status message ${msg.id}`);
		statusMsg = msg;
		return msg;
	} catch (error) {
		console.error(`Failed to create status message: ${error.message}`);
		throw error;
	}
}

export async function updateStatusMsg(field, value) {
	status[field] = value;

	if (!statusMsg) {
		await createStatusMsg();
		return;
	}

	try {
		const embed = createStatusEmbed(status);
		await statusMsg.edit({ embeds: [embed] });
	} catch (error) {
		console.error(`Failed to update status message: ${error.message}`);
	}
}
