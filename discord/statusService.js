import { createStatusEmbed } from "./embeds.js";
import { sendEmbedMsg, wipeMessages } from "./messageService.js";

let statusMsg;

const status = {
	status: "offline",
	name: null,
	health: null,
	hunger: null,
	ping: null,
	coords: null,
	dimension: null,
	info: "No info specified",
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

async function updateStatusMsg() {
	// If there is no status message, create a new one
	if (!statusMsg) {
		await createStatusMsg();
		return;
	}

	// If there is, try to update it
	try {
		const embed = createStatusEmbed(status);
		await statusMsg.edit({ embeds: [embed] });
	} catch (error) {
		console.error(`Failed to update status message: ${error.message}`);
	}
}

export async function updateStatusField(field, value) {
	status[field] = value;
	await updateStatusMsg();
}

export async function bulkUpdateStatusField(data) {
	for (const key of Object.keys(status)) {
		if (data[key] !== undefined && data[key] !== null) {
			status[key] = data[key];
		}
	}
	await updateStatusMsg();
}
