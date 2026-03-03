import express from "express";
import { apiKeyMiddleware } from "./auth.js";

import { sendEmbedMsg } from "../discord/messageService.js";
import { createMessage } from "../discord/embeds.js";
import {
	validateStatusField,
	updateStatusMsg,
} from "../discord/statusService.js";

export function createRouter() {
	const app = express();
	app.use(express.json());

	app.get("/", (req, res) => {
		res.send("API is up");
	});

	// Send message
	app.post("/send-message", apiKeyMiddleware, async (req, res) => {
		const { msgHeader, msgContent } = req.body;

		// Validation
		if (!msgHeader || !msgContent) {
			return res
				.status(400)
				.json({ error: "msgHeader and msgContent are required" });
		}

		// Try to send a message
		try {
			await sendEmbedMsg(createMessage(msgHeader, msgContent));
			return res.status(200).json({ message: "Message sent successfully" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error" });
		}
	});

	// Update status
	app.patch("/status", apiKeyMiddleware, async (req, res) => {
		const { field, value } = req.body;

		// Validation
		if (!field || !value) {
			return res.status(400).json({ error: "Field and value are required" });
		}
		if (!validateStatusField(field)) {
			return res.status(400).json({ error: "Field is invalid" });
		}

		// Try to update status
		try {
			await updateStatusMsg(field, value);
			return res.status(200).json({ message: "Status updates successfully" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal server error" });
		}
	});

	return app;
}
